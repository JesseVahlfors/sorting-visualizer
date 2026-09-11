import { useEffect, useState } from "react";

function VisualizationArea() {
  const [array, setArray] = useState(createRandomArray);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [displayArray, setDisplayArray] = useState(array);
  const [activeIndices, setActiveIndices] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const showDebugControls = false;

  function createRandomArray() {
    const newArray = [];

    for (let i = 0; i < 15; i++) {
      newArray.push(Math.floor(Math.random() * 10) + 1);
    }

    return newArray;
  }

  function generateArray() {
    setError("");
    const newArray = createRandomArray;
    setArray(newArray);
    setDisplayArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setActiveIndices([]);
    setIsPlaying(false);
  }

  function handleSort() {
    setError("");
    fetch("http://127.0.0.1:8000/api/sorting/bubble-sort/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array: array,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch sorting data");
        }

        return response.json();
      })
      .then((data) => {
        setSteps(data.steps);
        setCurrentStep(0);
        setDisplayArray([...array]);
        setActiveIndices([]);
        if (!showDebugControls) {
          setIsPlaying(true);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function stepHandler() {
    if (currentStep >= steps.length) {
      setIsPlaying(false);
      setActiveIndices([]);
      return;
    }

    const step = steps[currentStep];

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

    setCurrentStep((prev) => prev + 1);
  }

  function playHandler() {
    setIsPlaying(true);
  }

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      stepHandler();
    }, 150);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  return (
    <div>
      <h2>Visualization</h2>
      <div className="visualizer">
        {!error
          ? displayArray.map((value, index) => (
              <div
                key={index}
                className={
                  activeIndices.includes(index) && isPlaying
                    ? "bar active"
                    : "bar"
                }
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
          <p>
            {steps[currentStep].indices[0]} and {steps[currentStep].indices[1]}
          </p>
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
            onClick={stepHandler}
            disabled={steps.length === 0 || currentStep >= steps.length}
          >
            Advance Step
          </button>
          <button onClick={playHandler}>Play</button>
        </>
      )}
    </div>
  );
}

export default VisualizationArea;
