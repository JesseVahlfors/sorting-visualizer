import { useState, useCallback } from "react";
import usePlayback from "../hooks/usePlayback";
import ControlsArea from "./ControlsArea";

function VisualizationArea() {
  const [array, setArray] = useState(createRandomArray);
  const [displayArray, setDisplayArray] = useState(array);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [heldKey, setHeldKey] = useState(null);
  const [gapIndex, setGapIndex] = useState(null);
  const [error, setError] = useState("");
  const [barDepth, setBarDepth] = useState([]);
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
        setActiveIndices([]);
      }

      if (step.type === "hold") {
        setGapIndex(step.index);
        setHeldKey({
          value: step.value,
          index: step.index,
        });
      }

      if (step.type === "release") {
        setHeldKey(null);
        setGapIndex(null);
      }

      if (step.type === "write") {
        setDisplayArray((prev) => {
          const next = [...prev];

          next[step.index] = step.value;

          setGapIndex(step.gap);

          return next;
        });
      }

      if (step.type === "move") {
        setDisplayArray((prev) => {
          const next = [...prev];
          const removed = next.splice(step.from, 1);
          next.splice(step.to, 0, ...removed);
          return next;
        });

        setActiveIndices([step.to, step.to + 1]);
      }

      if (step.type === "group") {
        setBarDepth((prev) => {
          const next = [...prev];
          for (let i = step.start; i < step.start + step.length; i++) {
            next[i] = step.depth;
          }
          return next;
        });
      }
    },
    [
      setActiveIndices,
      setDisplayArray,
      setSortedIndices,
      setHeldKey,
      setGapIndex,
      setBarDepth,
    ],
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
    const arrayLength = Math.floor(Math.random() * 11) + 5;

    for (let i = 0; i < arrayLength; i++) {
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
    setGapIndex(null);
    setHeldKey(null);
    setBarDepth(newArray.map(() => 0));
  }

  function handleSort() {
    setError("");
    fetch("http://127.0.0.1:8000/api/sorting/sort/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ array, algorithm: selectedAlgorithm }),
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
        setBarDepth(array.map(() => 0));
        setActiveIndices([]);
        setSortedIndices([]);
        setGapIndex(null);
        setHeldKey(null);
        if (!showDebugControls) {
          play();
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <div className="card-container">
      <h2>Visualization</h2>
      <div className="visualizer">
        <div className="bars">
          {!error
            ? displayArray.map((value, index) => (
                <div
                  className="bar-slot"
                  key={index}
                  style={{
                    transform: `translateY(${-barDepth[index] * 40}px)`,
                  }}
                >
                  <div
                    className={`bar
              ${activeIndices.includes(index) ? "active" : ""}
              ${sortedIndices.includes(index) ? "sorted" : ""}
              ${gapIndex === index ? "gap" : ""}
            `}
                    style={{ height: `${value * 20}px` }}
                  >
                    {value}
                  </div>

                  {heldKey !== null && gapIndex === index && (
                    <div
                      className="bar held-key"
                      style={{ height: `${heldKey.value * 20}px` }}
                    >
                      {heldKey.value}
                    </div>
                  )}
                </div>
              ))
            : error}
        </div>
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
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
      />
    </div>
  );
}

export default VisualizationArea;
