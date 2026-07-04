import { Excalidraw, exportToBlob, exportToSvg } from "@excalidraw/excalidraw";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { getStyleRenderProfile, type AgentDrawStyle } from "@agentdraw/styles";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import {
  downloadBlob,
  type BoardHandle,
  type BoardProviderProps,
  type BoardSnapshot,
} from "../types";

export const ExcalidrawBoard = forwardRef<BoardHandle, BoardProviderProps>(
  ({ scene, style, onChange, replay }, ref) => {
    const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
    const [apiReady, setApiReady] = useState(false);
    const replayEnabled = replay?.enabled === true && scene.elements.length > 0;
    const suppressChangeRef = useRef(replayEnabled);
    const styledAppState = useMemo(
      () => applyStyleToAppState(scene.appState as Partial<AppState>, style),
      [scene.appState, style],
    );
    const initialData = useMemo(
      (): ExcalidrawInitialDataState => ({
        elements: replayEnabled ? [] : (scene.elements as readonly ExcalidrawElement[]),
        appState: styledAppState,
        files: scene.files as BinaryFiles,
      }),
      [scene.elements, scene.files, replayEnabled, styledAppState],
    );

    useEffect(() => {
      const api = apiRef.current;
      if (!api || !apiReady || !replayEnabled) {
        replay?.onProgress?.({
          active: false,
          current: scene.elements.length,
          total: scene.elements.length,
        });
        return;
      }

      let cancelled = false;
      let visibleCount = 0;
      const orderedElements = orderElementsForReplay(scene.elements);
      const batchSize = replay.batchSize ?? preferredBatchSize(orderedElements.length);
      const intervalMs = replay.intervalMs ?? 120;
      suppressChangeRef.current = true;

      api.updateScene({
        elements: [],
        appState: styledAppState as AppState,
      });
      replay.onProgress?.({
        active: true,
        current: 0,
        total: orderedElements.length,
      });

      const revealNextBatch = () => {
        if (cancelled) {
          return;
        }
        visibleCount = Math.min(visibleCount + batchSize, orderedElements.length);
        api.updateScene({
          elements: orderedElements.slice(0, visibleCount) as readonly ExcalidrawElement[],
          appState: styledAppState as AppState,
        });
        replay.onProgress?.({
          active: visibleCount < orderedElements.length,
          current: visibleCount,
          total: orderedElements.length,
        });

        if (visibleCount < orderedElements.length) {
          window.setTimeout(revealNextBatch, intervalMs);
          return;
        }

        api.updateScene({
          elements: scene.elements as readonly ExcalidrawElement[],
          appState: styledAppState as AppState,
        });
        window.setTimeout(() => {
          if (!cancelled) {
            suppressChangeRef.current = false;
          }
        }, 500);
      };

      window.setTimeout(revealNextBatch, 240);

      return () => {
        cancelled = true;
        suppressChangeRef.current = false;
      };
    }, [
      apiReady,
      replayEnabled,
      replay,
      scene.elements,
      styledAppState,
    ]);

    useImperativeHandle(ref, () => ({
      getSnapshot: () => snapshotFromApi(apiRef.current),
      setStyleDefaults: (nextStyle) => {
        const api = apiRef.current;
        if (!api) {
          return null;
        }
        const nextAppState = applyStyleToAppState(api.getAppState(), nextStyle);
        api.updateScene({ appState: nextAppState as AppState });
        return snapshotFromApi(api, nextAppState);
      },
      applyStyleToBoard: (nextStyle) => {
        const api = apiRef.current;
        if (!api) {
          return null;
        }
        const nextElements = applyStyleToElements(api.getSceneElements(), nextStyle);
        const nextAppState = applyStyleToAppState(api.getAppState(), nextStyle);
        api.updateScene({
          elements: nextElements as readonly ExcalidrawElement[],
          appState: nextAppState as AppState,
        });
        return snapshotFromApi(api, nextAppState, nextElements);
      },
      exportPng: async (title) => {
        const api = apiRef.current;
        if (!api) {
          return;
        }
        const blob = await exportToBlob({
          elements: api.getSceneElements(),
          appState: {
            ...api.getAppState(),
            exportWithDarkMode: false,
          },
          files: api.getFiles(),
          mimeType: "image/png",
        });
        downloadBlob(blob, `${title || "board"}.png`);
      },
      exportSvg: async (title) => {
        const api = apiRef.current;
        if (!api) {
          return;
        }
        const svg = await exportToSvg({
          elements: api.getSceneElements(),
          appState: api.getAppState(),
          files: api.getFiles(),
        });
        downloadBlob(new Blob([svg.outerHTML], { type: "image/svg+xml" }), `${title}.svg`);
      },
    }));

    return (
      <Excalidraw
        excalidrawAPI={(api) => {
          apiRef.current = api;
          setApiReady(Boolean(api));
        }}
        initialData={initialData}
        onChange={(elements, appState, files) => {
          if (suppressChangeRef.current) {
            return;
          }
          onChange({
            elements,
            appState: appState as unknown as Record<string, unknown>,
            files: files as unknown as Record<string, unknown>,
          });
        }}
      />
    );
  },
);

const orderElementsForReplay = (elements: readonly unknown[]) => {
  const typed = elements.map((element, index) => ({ element, index }));
  return typed
    .sort((left, right) => {
      const stageDiff = replayStage(left.element) - replayStage(right.element);
      return stageDiff === 0 ? left.index - right.index : stageDiff;
    })
    .map(({ element }) => element);
};

const replayStage = (element: unknown) => {
  if (!isElementRecord(element)) {
    return 4;
  }
  if (element.type === "arrow" || element.type === "line") {
    return 4;
  }
  if (element.type === "text") {
    return 3;
  }
  if (isLargeFrameElement(element)) {
    return 0;
  }
  if (element.type === "rectangle" || element.type === "diamond" || element.type === "ellipse") {
    return 1;
  }
  return 2;
};

const isLargeFrameElement = (element: Record<string, unknown>) => {
  const width = typeof element.width === "number" ? Math.abs(element.width) : 0;
  const height = typeof element.height === "number" ? Math.abs(element.height) : 0;
  return width >= 700 && height >= 350;
};

const preferredBatchSize = (elementCount: number) => {
  if (elementCount > 120) {
    return 8;
  }
  if (elementCount > 60) {
    return 5;
  }
  return 3;
};

const snapshotFromApi = (
  api: ExcalidrawImperativeAPI | null,
  appState?: Partial<AppState>,
  elements?: readonly unknown[],
): BoardSnapshot => ({
  elements: elements ?? api?.getSceneElements() ?? [],
  appState: (appState ?? api?.getAppState() ?? {}) as Record<string, unknown>,
  files: (api?.getFiles() ?? {}) as Record<string, unknown>,
});

const applyStyleToAppState = (
  appState: Partial<AppState>,
  style: AgentDrawStyle,
): Partial<AppState> => {
  const profile = getStyleRenderProfile(style);
  return {
    ...appState,
    viewBackgroundColor: style.palette.canvas,
    currentItemStrokeColor: style.palette.ink,
    currentItemBackgroundColor: style.palette.panel,
    currentItemFillStyle: "solid",
    currentItemStrokeWidth: profile.strokeWidth,
    currentItemStrokeStyle: "solid",
    currentItemRoughness: profile.roughness,
    currentItemFontFamily: fontFamilyForProfile(profile.fontFamily),
    currentItemRoundness: profile.roundness,
    currentItemArrowType: profile.arrowType,
    currentItemStartArrowhead: null,
    currentItemEndArrowhead: "arrow",
  };
};

const applyStyleToElements = (
  elements: readonly unknown[],
  style: AgentDrawStyle,
): readonly unknown[] => {
  const fills = [
    style.palette.panel,
    style.palette.accent2,
    style.palette.accent3,
    style.palette.accent,
  ];
  let fillIndex = 0;
  const profile = getStyleRenderProfile(style);

  return elements.map((element) => {
    if (!isElementRecord(element) || element.isDeleted) {
      return element;
    }

    if (element.type === "text") {
      return {
        ...element,
        strokeColor: style.palette.ink,
        backgroundColor: "transparent",
        roughness: profile.roughness,
        fontFamily: fontFamilyForProfile(profile.fontFamily),
        version: bumpNumber(element.version),
        versionNonce: randomNonce(),
        updated: Date.now(),
      };
    }

    if (element.type === "arrow" || element.type === "line") {
      return {
        ...element,
        strokeColor: style.palette.accent,
        backgroundColor: "transparent",
        roughness: profile.roughness,
        strokeWidth: profile.strokeWidth,
        strokeStyle: "solid",
        roundness: profile.geometry === "formal" ? null : { type: 2 },
        elbowed: profile.arrowType === "elbow",
        version: bumpNumber(element.version),
        versionNonce: randomNonce(),
        updated: Date.now(),
      };
    }

    if (
      element.type === "rectangle" ||
      element.type === "diamond" ||
      element.type === "ellipse"
    ) {
      const fill = fills[fillIndex % fills.length];
      fillIndex += 1;
      return {
        ...element,
        strokeColor: style.palette.ink,
        backgroundColor: fill,
        fillStyle: "solid",
        strokeWidth: profile.strokeWidth,
        strokeStyle: "solid",
        roughness: profile.roughness,
        roundness: roundnessForElement(element.type, profile.geometry),
        version: bumpNumber(element.version),
        versionNonce: randomNonce(),
        updated: Date.now(),
      };
    }

    return {
      ...element,
      strokeColor: style.palette.ink,
      strokeWidth: profile.strokeWidth,
      strokeStyle: "solid",
      roughness: profile.roughness,
      version: bumpNumber(element.version),
      versionNonce: randomNonce(),
      updated: Date.now(),
    };
  });
};

const isElementRecord = (element: unknown): element is Record<string, unknown> =>
  typeof element === "object" && element !== null && "type" in element;

const bumpNumber = (value: unknown) => (typeof value === "number" ? value + 1 : 1);

const randomNonce = () => Math.floor(Math.random() * 2 ** 31);

const fontFamilyForProfile = (fontFamily: "hand" | "sans" | "mono") => {
  if (fontFamily === "sans") {
    return 2;
  }
  if (fontFamily === "mono") {
    return 3;
  }
  return 1;
};

const roundnessForElement = (type: unknown, geometry: "organic" | "clean" | "formal") => {
  if (geometry === "formal") {
    return null;
  }
  if (type === "rectangle") {
    return { type: 3 };
  }
  return null;
};
