function ControlsArea({
  onSort,
  isPlaying,
  play,
  pause,
  speed,
  setSpeed,
  generateArray,
  canPlay,
}) {
  return (
    <div className="controls-area">
      <button onClick={generateArray} disabled={isPlaying}>
        Generate Array
      </button>
      <button onClick={onSort}>Sort</button>
      {isPlaying ? (
        <button onClick={pause}>Pause</button>
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
