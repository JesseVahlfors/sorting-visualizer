import { useEffect, useState } from "react";

function usePlayback(applyOperation) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function advanceStep() {
    if (currentStep >= steps.length) {
      setIsPlaying(false);
      return;
    }

    const step = steps[currentStep];

    applyOperation(step);

    setCurrentStep((prev) => prev + 1);
  }

  function play() {
    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  function reset() {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }

  function loadSteps(newSteps) {
    setSteps(newSteps);
    setCurrentStep(0);
  }

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      advanceStep();
    }, 150);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  return {
    steps,
    currentStep,
    isPlaying,
    play,
    loadSteps,
    pause,
    advanceStep,
    reset,
  };
}

export default usePlayback;
