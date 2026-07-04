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
    const boardRootRef = useRef<HTMLDivElement | null>(null);
    const [apiReady, setApiReady] = useState(false);
    const replayEnabled = replay?.enabled === true && scene.elements.length > 0;
    const suppressChangeRef = useRef(true);
    const fitSceneKeyRef = useRef<string | null>(null);
    const normalizedElements = useMemo(
      () => normalizeElementsForExcalidraw(scene.elements, style),
      [scene.elements, style],
    );
    const sceneKey = useMemo(
      () =>
        normalizedElements
          .map((element, index) => (isElementRecord(element) ? element.id : `unknown-${index}`))
          .join(":"),
      [normalizedElements],
    );
    const styledAppState = useMemo(
      () => applyStyleToAppState(sanitizeInitialAppState(scene.appState), style),
      [scene.appState, style],
    );
    const initialData = useMemo(
      (): ExcalidrawInitialDataState => ({
        elements: replayEnabled ? [] : (normalizedElements as readonly ExcalidrawElement[]),
        appState: styledAppState,
        files: scene.files as BinaryFiles,
        scrollToContent: false,
      }),
      [normalizedElements, scene.files, replayEnabled, styledAppState],
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
      const orderedElements = orderElementsForReplay(normalizedElements);
      const batchSize = replay.batchSize ?? 1;
      const intervalMs = replay.intervalMs ?? 70;
      suppressChangeRef.current = true;
      fitSceneKeyRef.current = sceneKey;

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
          elements: normalizedElements as readonly ExcalidrawElement[],
          appState: styledAppState as AppState,
        });
        fitBoardToContent(api, normalizedElements, boardRootRef.current);
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
      sceneKey,
      normalizedElements,
      styledAppState,
    ]);

    useEffect(() => {
      const api = apiRef.current;
      if (!api || !apiReady || replayEnabled || normalizedElements.length === 0) {
        if (api && apiReady && !replayEnabled && normalizedElements.length === 0) {
          window.setTimeout(() => {
            suppressChangeRef.current = false;
          }, 350);
        }
        return;
      }
      if (fitSceneKeyRef.current === sceneKey) {
        return;
      }
      suppressChangeRef.current = true;
      api.updateScene({
        elements: normalizedElements as readonly ExcalidrawElement[],
        appState: styledAppState as AppState,
      });

      let cancelled = false;
      const timers: number[] = [];
      const fitWhenReady = () => {
        if (cancelled) {
          return;
        }
        if (fitBoardToContent(api, normalizedElements, boardRootRef.current)) {
          fitSceneKeyRef.current = sceneKey;
        }
      };
      window.requestAnimationFrame(() => window.requestAnimationFrame(fitWhenReady));
      for (const delay of [160, 480, 900, 1500, 2400]) {
        timers.push(window.setTimeout(fitWhenReady, delay));
      }
      const resizeObserver =
        boardRootRef.current && "ResizeObserver" in window
          ? new ResizeObserver(fitWhenReady)
          : null;
      if (resizeObserver && boardRootRef.current) {
        resizeObserver.observe(boardRootRef.current);
      }
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) {
            suppressChangeRef.current = false;
          }
        }, 1200),
      );

      return () => {
        cancelled = true;
        resizeObserver?.disconnect();
        timers.forEach((timer) => window.clearTimeout(timer));
        suppressChangeRef.current = false;
      };
    }, [apiReady, replayEnabled, sceneKey, normalizedElements, styledAppState]);

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
      <div ref={boardRootRef} className="board-host">
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
      </div>
    );
  },
);

const orderElementsForReplay = (elements: readonly unknown[]) => {
  const typed = elements.map((element, index) => ({ element, index }));
  return typed
    .sort((left, right) => {
      const stageDiff = replayStage(left.element) - replayStage(right.element);
      if (stageDiff !== 0) {
        return stageDiff;
      }
      const leftPosition = replayPosition(left.element);
      const rightPosition = replayPosition(right.element);
      const yDiff = leftPosition.y - rightPosition.y;
      if (Math.abs(yDiff) > 8) {
        return yDiff;
      }
      const xDiff = leftPosition.x - rightPosition.x;
      return xDiff === 0 ? left.index - right.index : xDiff;
    })
    .map(({ element }) => element);
};

const normalizeElementsForExcalidraw = (
  elements: readonly unknown[],
  style: AgentDrawStyle,
) => {
  const profile = getStyleRenderProfile(style);
  const expectedFontFamily = fontFamilyForProfile(profile.fontFamily);
  const now = Date.now();
  const elementById = new Map(
    elements
      .filter(isElementRecord)
      .filter((element) => typeof element.id === "string")
      .map((element) => [String(element.id), element]),
  );
  const containedTextIds = new Set(
    elements
      .filter(isElementRecord)
      .filter((element) => element.type === "text" && containedTextBox(element, elementById))
      .map((element) => String(element.id)),
  );
  return elements.map((element) => {
    if (!isElementRecord(element)) {
      return element;
    }
    if (element.type !== "text") {
      if (Array.isArray(element.boundElements)) {
        const nextBoundElements = element.boundElements.filter(
          (bound) =>
            !(
              bound &&
              typeof bound === "object" &&
              containedTextIds.has(String((bound as { id?: unknown }).id))
            ),
        );
        if (nextBoundElements.length !== element.boundElements.length) {
          return {
            ...element,
            boundElements: nextBoundElements,
            version: bumpNumber(element.version),
            versionNonce: randomNonce(),
            updated: now,
          };
        }
      }
      return element;
    }

    const text = typeof element.text === "string" ? element.text : "";
    const fontSize = typeof element.fontSize === "number" ? element.fontSize : 18;
    const lineHeight = typeof element.lineHeight === "number" ? element.lineHeight : 1.25;
    const containedBox = containedTextBox(element, elementById);
    const normalizedBox = containedBox
      ? centeredTextBounds(containedBox, text, fontSize, lineHeight)
      : null;
    const width = normalizedBox?.width ?? element.width;
    const height = normalizedBox?.height ?? element.height;
    const hasLayoutChange = Boolean(
      normalizedBox &&
        (numberChanged(element.x, normalizedBox.x) ||
          numberChanged(element.y, normalizedBox.y) ||
          numberChanged(element.width, normalizedBox.width) ||
          numberChanged(element.height, normalizedBox.height) ||
          element.verticalAlign !== "middle" ||
          element.textAlign !== "center" ||
          element.autoResize !== false ||
          element.containerId !== null),
    );
    return {
      ...element,
      ...(normalizedBox
        ? {
            x: normalizedBox.x,
            y: normalizedBox.y,
            width: normalizedBox.width,
            height: normalizedBox.height,
          }
        : null),
      text,
      originalText: typeof element.originalText === "string" ? element.originalText : text,
      fontSize,
      fontFamily: expectedFontFamily,
      textAlign:
        typeof element.textAlign === "string" ? element.textAlign : containedBox ? "center" : "left",
      verticalAlign: containedBox
        ? "middle"
        : typeof element.verticalAlign === "string"
          ? element.verticalAlign
          : "middle",
      autoResize: containedBox ? false : typeof element.autoResize === "boolean" ? element.autoResize : false,
      containerId: containedBox ? null : element.containerId,
      lineHeight,
      baseline: containedBox
        ? Math.round(fontSize * lineHeight * Math.max(1, text.split("\n").length) * 0.78)
        : typeof element.baseline === "number"
          ? element.baseline
          : Math.round(fontSize * lineHeight * Math.max(1, text.split("\n").length) * 0.78),
      width,
      height,
      backgroundColor:
        typeof element.backgroundColor === "string" ? element.backgroundColor : "transparent",
      ...(hasLayoutChange
        ? {
            version: bumpNumber(element.version),
            versionNonce: randomNonce(),
            updated: now,
          }
        : null),
    };
  });
};

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const containedTextBox = (
  text: Record<string, unknown>,
  elementById: Map<string, Record<string, unknown>>,
): Box | null => {
  if (typeof text.containerId === "string") {
    const container = toBox(elementById.get(text.containerId));
    if (container) {
      return container;
    }
  }

  for (const element of elementById.values()) {
    if (
      !["rectangle", "diamond", "ellipse"].includes(String(element.type)) ||
      !Array.isArray(element.boundElements)
    ) {
      continue;
    }
    const boundToText = element.boundElements.some((bound) =>
      Boolean(
        bound &&
          typeof bound === "object" &&
          (bound as { id?: unknown; type?: unknown }).id === text.id &&
          (bound as { type?: unknown }).type === "text",
      ),
    );
    if (boundToText) {
      return toBox(element);
    }
  }
  return null;
};

const toBox = (element: Record<string, unknown> | undefined): Box | null => {
  if (
    !element ||
    typeof element.x !== "number" ||
    typeof element.y !== "number" ||
    typeof element.width !== "number" ||
    typeof element.height !== "number"
  ) {
    return null;
  }
  return {
    x: Math.min(element.x, element.x + element.width),
    y: Math.min(element.y, element.y + element.height),
    width: Math.abs(element.width),
    height: Math.abs(element.height),
  };
};

const insetBounds = (box: Box, padding: number): Box => ({
  x: box.x + padding,
  y: box.y + padding,
  width: Math.max(1, box.width - padding * 2),
  height: Math.max(1, box.height - padding * 2),
});

const defaultTextPadding = (box: Box) =>
  Math.max(8, Math.min(20, Math.round(Math.min(box.width, box.height) * 0.16)));

const centeredTextBounds = (
  box: Box,
  text: string,
  fontSize: number,
  lineHeight: number,
): Box => {
  const padding = defaultTextPadding(box);
  const lineCount = Math.max(1, text.split("\n").length);
  const textHeight = Math.max(1, lineCount * fontSize * lineHeight);
  return {
    x: box.x + padding,
    y: box.y + (box.height - textHeight) / 2,
    width: Math.max(1, box.width - padding * 2),
    height: textHeight,
  };
};

const numberChanged = (left: unknown, right: number) =>
  typeof left !== "number" || Math.abs(left - right) > 0.5;

const centeredBaseline = (
  text: string,
  fontSize: number,
  lineHeight: number,
  height: number | undefined,
) => {
  if (typeof height !== "number") {
    return Math.round(fontSize * lineHeight * Math.max(1, text.split("\n").length) * 0.78);
  }
  return Math.round((height - text.split("\n").length * fontSize * lineHeight) / 2 + fontSize);
};

const sanitizeInitialAppState = (appState: Record<string, unknown>) => {
  const {
    scrollX,
    scrollY,
    zoom,
    offsetLeft,
    offsetTop,
    width,
    height,
    showWelcomeScreen,
    selectedElementIds,
    selectedGroupIds,
    editingTextElement,
    editingGroupId,
    newElement,
    activeEmbeddable,
    openMenu,
    openPopup,
    openSidebar,
    openDialog,
    toast,
    currentItemRoundness,
    ...safeAppState
  } = appState;
  void scrollX;
  void scrollY;
  void zoom;
  void offsetLeft;
  void offsetTop;
  void width;
  void height;
  void showWelcomeScreen;
  void selectedElementIds;
  void selectedGroupIds;
  void editingTextElement;
  void editingGroupId;
  void newElement;
  void activeEmbeddable;
  void openMenu;
  void openPopup;
  void openSidebar;
  void openDialog;
  void toast;
  void currentItemRoundness;
  return safeAppState as Partial<AppState>;
};

const fitBoardToContent = (
  api: ExcalidrawImperativeAPI,
  elements: readonly unknown[],
  container: HTMLElement | null,
) => {
  if (!container) {
    return false;
  }
  const rect = container.getBoundingClientRect();
  if (rect.width < 120 || rect.height < 120) {
    return false;
  }
  const drawableElements = elements.filter(isElementRecord) as unknown as readonly ExcalidrawElement[];
  if (drawableElements.length === 0) {
    return false;
  }
  api.scrollToContent(drawableElements, {
    animate: false,
    fitToViewport: true,
    viewportZoomFactor: 0.7,
    minZoom: 0.35,
    maxZoom: 0.72,
  });
  return true;
};

const replayStage = (element: unknown) => {
  if (!isElementRecord(element)) {
    return 4;
  }
  if (element.type === "arrow" || element.type === "line") {
    return 3;
  }
  if (isLargeFrameElement(element)) {
    return 0;
  }
  return 1;
};

const isLargeFrameElement = (element: Record<string, unknown>) => {
  const width = typeof element.width === "number" ? Math.abs(element.width) : 0;
  const height = typeof element.height === "number" ? Math.abs(element.height) : 0;
  return width >= 700 && height >= 350;
};

const replayPosition = (element: unknown) => {
  if (!isElementRecord(element)) {
    return { x: 0, y: 0 };
  }
  const x = typeof element.x === "number" ? element.x : 0;
  const y = typeof element.y === "number" ? element.y : 0;
  return { x, y };
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
