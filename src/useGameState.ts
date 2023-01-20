import { useCallback, useEffect, useRef, useState } from "react";
import { useBeatLoop } from "./useBeatLoop";
let results: number[] = [];
type Result = {
  points: number;
  isEarly: boolean;
};
export type ResultsDisplay = {
  diffs: Result[];
  score: number;
};

export const coolEvent = new CustomEvent("coolEvent");

export const useGameState = () => {
  const { startLoop, stopLoop, error, loading, playing } = useBeatLoop();
  const [count, setCount] = useState(123123);
  const [resultsDisplay, setResultsDisplay] = useState<ResultsDisplay>();
  const tapEventListener = useCallback((event: KeyboardEvent | MouseEvent) => {
    const now = Date.now();
    if (event.type === "keydown" && (event as KeyboardEvent).key !== " ") {
      return;
    }
    if (results.length !== 0) document.dispatchEvent(coolEvent);
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
    results = [];
    setCount(-6);
    startLoop();
    bindListeners();
  }, []);

  useEffect(() => {
    if (count === 0) {
      stopLoop();
    } else if (count >= 20) {
      unbindListeners();
      // calculate last 20 results
      const a = results.slice(-21);
      const diffs = a
        .map((value, index, arr) => {
          if (index === 0) {
            return { points: 0, isEarly: false };
          } else {
            const timeSinceLast = value - arr[index - 1];
            const offsetFromExpected = 500 - timeSinceLast;
            const isEarly = offsetFromExpected > 0;
            const exactDifference = Math.abs(offsetFromExpected);
            const gatedValue = Math.max(0, 200 - exactDifference);
            const points = Math.floor(50 * (gatedValue / 200));
            return { points, isEarly };
          }
        })
        .slice(1); // remove starting point from results

      setResultsDisplay({
        diffs: diffs,
        score: diffs.reduce((accum, current) => accum + current.points, 0),
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
