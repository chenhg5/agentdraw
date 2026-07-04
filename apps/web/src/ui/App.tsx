import { Editor } from "./Editor";
import { useSceneFile } from "../scene/useSceneFile";

export const App = () => {
  const sceneFile = useSceneFile();

  if (sceneFile.error && !sceneFile.scene) {
    return (
      <main className="shell shell--center">
        <div className="error-panel">
          <h1>AgentDraw</h1>
          <p>{sceneFile.error}</p>
        </div>
      </main>
    );
  }

  if (!sceneFile.scene) {
    return (
      <main className="shell shell--center">
        <div className="loading">Loading board...</div>
      </main>
    );
  }

  return (
    <Editor
      filePath={sceneFile.filePath}
      scene={sceneFile.scene}
      error={sceneFile.error}
      saveState={sceneFile.saveState}
      onSceneChange={sceneFile.queueSave}
    />
  );
};
