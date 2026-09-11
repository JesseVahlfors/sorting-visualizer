import "./App.css";
import Header from "./components/Header";
import VisualizationArea from "./components/VisualizationArea";
import ControlsArea from "./components/ControlsArea";

function App() {
  return (
    <>
      <div>
        <Header />
        <VisualizationArea />
        <ControlsArea />
      </div>
    </>
  );
}

export default App;
