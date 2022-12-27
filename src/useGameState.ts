import { useCallback, useEffect, useRef, useState } from "react";
import { useBeatLoop } from "./useBeatLoop";
const results: number[] = [];
export type ResultsDisplay = {
  diffs: number[];
  score: number;
};
export const useGameState = () => {
  const { startLoop, stopLoop, error, loading, playing } = useBeatLoop();
  const [count, setCount] = useState(123123);
  const [resultsDisplay, setResultsDisplay] = useState<ResultsDisplay>();
  const tapEventListener = useCallback((event: KeyboardEvent | MouseEvent) => {
    const now = Date.now();
    if (event.type === "keydown" && (event as KeyboardEvent).key !== " ") {
      return;
    }
    results.push(now);
    setCount((oldCount) => oldCount + 1);
  }, []);

  const bindListeners = useCallback(() => {
    document.addEventListener("keydown", tapEventListener);
    document.addEventListener("click", tapEventListener);
  }, []);

  const unbindListeners = useCallback(() => {
    document.removeEventListener("keydown", tapEventListener);
    document.removeEventListener("click", tapEventListener);
  }, []);

  const startGame = useCallback(() => {
    setCount(-17);
    startLoop();
    bindListeners();
  }, []);

  const restartGame = useCallback(() => {
    setCount(-12);
    startLoop();
    bindListeners();
  }, []);

  useEffect(() => {
    console.log(count);
    if (count === 0) {
      stopLoop();
    } else if (count >= 20) {
      unbindListeners();
      // calculate last 20 results
      console.log(results.length);
      const points = results.slice(-20);
      const startingPoint = results[results.length - 21];
      console.log("points", points);
      console.log("start: ", startingPoint);
      const diffs = points.map((value, index) => {
        return value - (startingPoint + 500 * (index + 1));
      });
      const score = diffs.reduce((accum, value) => accum + Math.abs(value), 0);
      setResultsDisplay({
        diffs: diffs,
        score: score,
      });
    }
  }, [count]);

  return {
    startGame,
    restartGame,
    count,
    results,
    error,
    loading,
    playing,
    resultsDisplay,
  };
};
