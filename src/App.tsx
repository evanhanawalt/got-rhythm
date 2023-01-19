import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPlay,
  faComputerMouse,
  faKeyboard,
  faMoon,
  faSun,
  faVolumeHigh,
  faVolumeXmark,
  faHeadphones,
  faMicrophone,
  faRecordVinyl,
  faMusic,
  faGuitar,
  faDrum,
  faMicrophoneLinesSlash,
  faCirclePlay,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import { useDarkMode } from "./useDarkMode";
import { useGameState } from "./useGameState";
import ResultsChart from "./ResultsChart";

const Game = () => {
  const { startGame, restartGame, count, resultsDisplay } = useGameState();

  if (count === 123123) {
    return (
      <>
        <h1 className="nowrap text-4xl md:text-8xl">Got Rhythm?</h1>

        <div className="flex flex-row items-center p-5">
          <p className="text-lg">turn up your volume and press play</p>
          <FontAwesomeIcon className="ml-3" icon={faVolumeHigh} />
        </div>

        <button
          className=" flex h-16 w-16 items-center justify-center rounded-full border-2 border-black hover:bg-gray-300 dark:border-white dark:hover:bg-gray-700"
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
        <div className="mt-4 flex flex-row gap-3">
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

function MotionFeedback({ top, left, rotate }: MotionFeedbackProps) {
  const randomIcons = useMemo(() => {
    return [
      faVolumeHigh,
      faVolumeXmark,
      faHeadphones,
      faMicrophone,
      faRecordVinyl,
      faMusic,
      faGuitar,
      faDrum,
      faMicrophoneLinesSlash,
      faCirclePlay,
    ];
  }, []);
  const currentIndex = Math.floor(Math.random() * randomIcons.length);
  return (
    <FontAwesomeIcon
      className={`disappear rotate absolute`}
      style={{
        top: top,
        left: left,
      }}
      size="4x"
      transform={{ rotate: rotate }}
      icon={randomIcons[currentIndex]}
    />
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
        rotate: Math.round(Math.random() * 180) - 90,
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
      <menu className="flex w-full flex-row justify-between pl-5 pr-5">
        <a href="https://github.com/evanhanawalt/got-rhythm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-black dark:fill-white"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
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
