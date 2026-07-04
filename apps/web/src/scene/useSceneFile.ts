import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadScene, saveScene } from "./api";
import type { AgentDrawScene, SaveState } from "./types";

export const useSceneFile = () => {
  const filePath = useMemo(() => readFilePathFromUrl(), []);
  const [scene, setScene] = useState<AgentDrawScene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimer = useRef<number | null>(null);
  const latestSaveId = useRef(0);
  const loadedAt = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadScene(filePath)
      .then((envelope) => {
        if (!cancelled) {
          setScene(envelope.scene);
          loadedAt.current = Date.now();
          setError(null);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load scene.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [filePath]);

  const queueSave = useCallback(
    (
      elements: readonly unknown[],
      appState: Record<string, unknown>,
      files: Record<string, unknown>,
      styleId?: string,
      providerId?: string,
    ) => {
      if (!scene) {
        return;
      }
      const loadedRecently =
        loadedAt.current !== null && Date.now() - loadedAt.current < 2500;
      if (loadedRecently && scene.elements.length > 0 && elements.length === 0) {
        return;
      }
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
      setSaveState("saving");
      const saveId = latestSaveId.current + 1;
      latestSaveId.current = saveId;

      saveTimer.current = window.setTimeout(() => {
        saveScene(filePath, {
          styleId: styleId ?? scene.styleId,
          providerId: providerId ?? scene.providerId,
          elements,
          appState: sanitizeAppState(appState),
          files,
        })
          .then((envelope) => {
            if (latestSaveId.current === saveId) {
              setScene(envelope.scene);
              setSaveState("saved");
              setError(null);
            }
          })
          .catch((saveError) => {
            if (latestSaveId.current === saveId) {
              setSaveState("error");
              setError(saveError instanceof Error ? saveError.message : "Failed to save scene.");
            }
          });
      }, 500);
    },
    [filePath, scene],
  );

  return {
    filePath,
    scene,
    error,
    saveState,
    queueSave,
  };
};

const readFilePathFromUrl = () => {
  const filePath = new URLSearchParams(window.location.search).get("file");
  return filePath?.trim() || ".agentdraw/untitled.agentdraw.json";
};

const sanitizeAppState = (appState: Record<string, unknown>) => {
  const {
    collaborators,
    suggestedBindings,
    startBoundElement,
    cursorButton,
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
    previousSelectedElementIds,
    hoveredElementIds,
    editingTextElement,
    editingGroupId,
    newElement,
    activeEmbeddable,
    openMenu,
    openPopup,
    openSidebar,
    openDialog,
    toast,
    ...persisted
  } = appState;
  void collaborators;
  void suggestedBindings;
  void startBoundElement;
  void cursorButton;
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
  void previousSelectedElementIds;
  void hoveredElementIds;
  void editingTextElement;
  void editingGroupId;
  void newElement;
  void activeEmbeddable;
  void openMenu;
  void openPopup;
  void openSidebar;
  void openDialog;
  void toast;
  return persisted;
};
