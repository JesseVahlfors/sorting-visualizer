import { useState, useCallback } from "react";
import usePlayback from "../hooks/usePlayback";
import ControlsArea from "./ControlsArea";

function VisualizationArea() {
  const [array, setArray] = useState(createRandomArray);
  const [displayArray, setDisplayArray] = useState(array);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [error, setError] = useState("");
  const showDebugControls = false;

  const applyOperation = useCallback(
    (step) => {
      if (step.type === "compare") {
        setActiveIndices(step.indices);
      }

      if (step.type === "swap") {
        setDisplayArray((prev) => {
          const next = [...prev];

          const [a, b] = step.indices;

          [next[a], next[b]] = [next[b], next[a]];

          return next;
        });
        setActiveIndices(step.indices);
      }

      if (step.type === "sorted") {
        setSortedIndices((prev) => [...prev, ...step.indices]);
      }
    },
    [setActiveIndices, setDisplayArray, setSortedIndices],
  );

  const {
    steps,
    currentStep,
    isPlaying,
    loadSteps,
    play,
    advanceStep,
    reset,
    pause,
    speed,
    setSpeed,
  } = usePlayback(applyOperation);

  const canPlay = steps.length > 0 && currentStep < steps.length;
  const canSort = !isPlaying && array.length > 0;

  function createRandomArray() {
    const newArray = [];

    for (let i = 0; i < 15; i++) {
      newArray.push(Math.floor(Math.random() * 10) + 1);
    }

    return newArray;
  }

  function generateArray() {
    setError("");

    const newArray = createRandomArray();

    setArray(newArray);
    setDisplayArray(newArray);

    reset();

    setActiveIndices([]);
    setSortedIndices([]);
  }

  function handleSort() {
    setError("");
    fetch("http://127.0.0.1:8000/api/sorting/bubble-sort/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ array }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch sorting data");
        }

        return response.json();
      })
      .then((data) => {
        loadSteps(data.steps);
        setDisplayArray([...array]);
        setActiveIndices([]);
        setSortedIndices([]);
        if (!showDebugControls) {
          play();
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <div>
      <h2>Visualization</h2>
      <div className="visualizer">
        {!error
          ? displayArray.map((value, index) => (
              <div
                key={index}
                className={`bar ${
                  activeIndices.includes(index) ? "active" : ""
                } ${sortedIndices.includes(index) ? "sorted" : ""}`}
                style={{ height: `${value * 20}px` }}
              >
                {value}
              </div>
            ))
          : error}
      </div>
      {steps.length > 0 && currentStep < steps.length && showDebugControls && (
        <div>
          <p>{steps[currentStep].type}</p>
          <p>{steps[currentStep].indices.join(", ")}</p>
        </div>
      )}
      {showDebugControls && (
        <>
          <button
            onClick={advanceStep}
            disabled={steps.length === 0 || currentStep >= steps.length}
          >
            Advance Step
          </button>
        </>
      )}
      <ControlsArea
        isPlaying={isPlaying}
        play={play}
        pause={pause}
        canPlay={canPlay}
        canSort={canSort}
        speed={speed}
        setSpeed={setSpeed}
        handleSort={handleSort}
        generateArray={generateArray}
      />
    </div>
  );
}

export default VisualizationArea;
