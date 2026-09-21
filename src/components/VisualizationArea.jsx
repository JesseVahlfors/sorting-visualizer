import { useState } from "react";
import usePlayback from "../hooks/usePlayback";

function VisualizationArea() {
  const [array, setArray] = useState(createRandomArray);
  const [displayArray, setDisplayArray] = useState(array);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const { steps, currentStep, isPlaying, loadSteps, play, advanceStep, reset } =
    usePlayback(applyOperation);
  const [error, setError] = useState("");
  const showDebugControls = true;

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

  function applyOperation(step) {
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
      {steps.length > 0 && currentStep < steps.length && (
        <div>
          <p>{steps[currentStep].type}</p>
          <p>{steps[currentStep].indices.join(", ")}</p>
        </div>
      )}
      <button onClick={generateArray} disabled={isPlaying}>
        Generate Array
      </button>
      <button onClick={handleSort} disabled={isPlaying || array.length === 0}>
        Sort
      </button>
      {showDebugControls && (
        <>
          <button
            onClick={advanceStep}
            disabled={steps.length === 0 || currentStep >= steps.length}
          >
            Advance Step
          </button>
          <button onClick={play}>Play</button>
        </>
      )}
    </div>
  );
}

export default VisualizationArea;
