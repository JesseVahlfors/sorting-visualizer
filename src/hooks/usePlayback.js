import { useEffect, useState, useCallback } from "react";

const speedDelays = {
  slow: 400,
  normal: 150,
  fast: 50,
};

function usePlayback(applyOperation, isPlaying, speed, onComplete) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const advanceStep = useCallback(() => {
    if (currentStep >= steps.length) {
      return;
    }

    const step = steps[currentStep];

    applyOperation(step);

    setCurrentStep((prev) => prev + 1);
    if (currentStep === steps.length - 1) {
      onComplete();
    }
  }, [applyOperation, steps, currentStep, onComplete]);

  function reset() {
    setSteps([]);
    setCurrentStep(0);
  }

  function loadSteps(newSteps) {
    setSteps(newSteps);
    setCurrentStep(0);
  }

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      advanceStep();
    }, speedDelays[speed]);
    return () => clearTimeout(timer);
  }, [isPlaying, speed, advanceStep]);

  return {
    steps,
    currentStep,
    isPlaying,
    loadSteps,
    advanceStep,
    reset,
  };
}

export default usePlayback;
