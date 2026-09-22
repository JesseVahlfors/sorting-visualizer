import { useEffect, useState, useCallback } from "react";

const speedDelays = {
  slow: 400,
  normal: 150,
  fast: 50,
};

function usePlayback(applyOperation) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");

  const advanceStep = useCallback(() => {
    if (currentStep >= steps.length) {
      setIsPlaying(false);
      return;
    }

    const step = steps[currentStep];

    applyOperation(step);

    setCurrentStep((prev) => prev + 1);

    if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
  }, [applyOperation, steps, currentStep]);

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
    }, speedDelays[speed]);
    return () => clearTimeout(timer);
  }, [isPlaying, speed, advanceStep]);

  return {
    steps,
    currentStep,
    isPlaying,
    play,
    loadSteps,
    pause,
    advanceStep,
    reset,
    speed,
    setSpeed,
  };
}

export default usePlayback;
