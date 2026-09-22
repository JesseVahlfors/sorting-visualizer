function ControlsArea({
  isPlaying,
  play,
  pause,
  canPlay,
  canSort,
  speed,
  setSpeed,
  generateArray,
  handleSort,
  selectedAlgorithm,
  setSelectedAlgorithm,
}) {
  return (
    <div>
      {/* need to capitalize in css */}
      <h2>{selectedAlgorithm} sort</h2>
      <h3>Controls</h3>
      <select
        value={selectedAlgorithm}
        onChange={(event) => setSelectedAlgorithm(event.target.value)}
      >
        <option value="bubble">Bubble Sort</option>
        <option value="selection">Selection Sort</option>
      </select>
      <button onClick={generateArray} disabled={isPlaying}>
        Generate Array
      </button>
      <button onClick={handleSort} disabled={!canSort}>
        Sort
      </button>
      {isPlaying ? (
        <button onClick={pause} disabled={!canPlay}>
          Pause
        </button>
      ) : (
        <button onClick={play} disabled={!canPlay}>
          Play
        </button>
      )}
      <select value={speed} onChange={(event) => setSpeed(event.target.value)}>
        <option value="slow">Slow</option>
        <option value="normal">Normal</option>
        <option value="fast">Fast</option>
      </select>
    </div>
  );
}

export default ControlsArea;
