import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPlay,
  faComputerMouse,
  faKeyboard,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useDarkMode } from "./useDarkMode";
import { useGameState } from "./useGameState";
import ResultsChart from "./ResultsChart";

const Game = () => {
  const { startGame, restartGame, count, resultsDisplay } = useGameState();

  if (count === 123123) {
    return (
      <>
        <h1 className="nowrap text-8xl">Got Rhythm?</h1>
        <audio src="/beat.wav" loop></audio>
        <button
          className="mt-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black hover:bg-gray-300 dark:border-white dark:hover:bg-gray-700"
          onClick={startGame}
        >
          <FontAwesomeIcon size="2x" icon={faPlay} />
        </button>
      </>
    );
  } else if (count < -12) {
    return (
      <>
        <p className="text-xl">tap along to the beat</p>
        <div className="flex flex-row gap-3">
          <FontAwesomeIcon size="xl" icon={faComputerMouse} />
          <FontAwesomeIcon size="xl" icon={faKeyboard} />
        </div>
      </>
    );
  } else if (count < -6) {
    return (
      <>
        <p key={"z"} className="text-xl">
          good, now try it on your own
        </p>
      </>
    );
  } else if (count < 0) {
    return (
      <>
        <p key={"a"} className="text-xl">
          the beat will fade out in... {Math.abs(count)}
        </p>
      </>
    );
  } else if (count < 20) {
    return (
      <>
        <p key={"g"} className="text-xl">
          keep going, good luck
        </p>
      </>
    );
  } else {
    return (
      <>
        {resultsDisplay !== undefined ? (
          <ResultsChart results={resultsDisplay} />
        ) : null}
        <button
          onClick={restartGame}
          className="border-2 border-black p-2 hover:bg-gray-300 dark:border-white dark:hover:bg-gray-700"
        >
          Try Again
        </button>
      </>
    );
  }
};

type MotionFeedbackProps = {
  top: number;
  left: number;
  rotate: number;
  key: number;
};
function MotionFeedback({ top, left, rotate, key }: MotionFeedbackProps) {
  return (
    <svg
      className={`disappear rotate absolute`}
      style={{
        top: top,
        left: left,
      }}
      width={100}
      height={100}
      key={key}
    >
      <rect
        width={100}
        height={100}
        className="fill-black stroke-black dark:fill-white dark:stroke-white"
        transform={`rotate(${Math.round(rotate)} 50 50 )`}
      />
    </svg>
  );
}

function App() {
  const { darkMode, setLightMode, setDarkMode } = useDarkMode();
  const [motionData, setMotionData] = useState<MotionFeedbackProps>();
  useEffect(() => {
    const handler = () => {
      setMotionData({
        left: Math.max(50, Math.random() * window.innerWidth - 150),
        top: Math.max(50, Math.random() * window.innerHeight - 150),
        rotate: Math.random() * 90,
        key: Math.random(),
      });
    };
    document.addEventListener("coolEvent", handler);
    return () => {
      document.removeEventListener("coolEvent", handler);
    };
  }, []);
  return (
    <main className="mt-5 flex w-full flex-col items-center gap-2">
      {motionData && (
        <MotionFeedback
          top={motionData.top}
          left={motionData.left}
          rotate={motionData.rotate}
          key={motionData.key}
        />
      )}
      <menu className="mr-5 self-end">
        <button onClick={darkMode ? setLightMode : setDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </menu>
      <div className="ani-fade flex w-full flex-col items-center">
        <Game />
      </div>
    </main>
  );
}

export default App;
