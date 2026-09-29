import { useRef, useState } from "react";
import AlgorithmCard from "./AlgorithmCard";
import ControlsArea from "./ControlsArea";

function VisualizationArea() {
  function handleCardComplete() {
    setIsPlaying(false);
    setIsCardReady(false);
  }

  function handleCardReady() {
    setIsCardReady(true);
  }

  function handleAlgorithmChange() {
    setIsCardReady(false);
  }

  const [array, setArray] = useState(createRandomArray);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [isCardReady, setIsCardReady] = useState(false);
  // Ref used to call the small command interface exposed by AlgorithmCard.
  const algorithmCardRef = useRef([]);

  function createRandomArray() {
    const newArray = [];
    const arrayLength = Math.floor(Math.random() * 30) + 5;

    for (let i = 0; i < arrayLength; i++) {
      newArray.push(Math.floor(Math.random() * 10) + 1);
    }

    return newArray;
  }

  function generateArray() {
    const newArray = createRandomArray();
    setArray(newArray);
    setIsCardReady(false);
    algorithmCardRef.current?.resetVisualization(newArray);
  }

  function loadSorts() {
    algorithmCardRef.current?.loadSort();
  }

  function play() {
    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  const cards = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

  return (
    <div className="visualization-area">
      {cards.map((card) => (
        <AlgorithmCard
          key={card.id}
          ref={algorithmCardRef}
          array={array}
          isPlaying={isPlaying}
          speed={speed}
          onComplete={handleCardComplete}
          onReady={handleCardReady}
          onAlgorithmChange={handleAlgorithmChange}
        />
      ))}
      <ControlsArea
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        speed={speed}
        setSpeed={setSpeed}
        onSort={loadSorts}
        generateArray={generateArray}
        play={play}
        pause={pause}
        canPlay={isCardReady && !isPlaying}
      />
    </div>
  );
}

export default VisualizationArea;
