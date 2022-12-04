import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  faPlay,
  faComputerMouse,
  faKeyboard,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useBeatLoop } from "./useBeatLoop";
import { useDarkMode } from "./useDarkMode";
enum States {
  Landing,
  TestingControls,
  WarmUp,
  InGame,
  Results,
}
const Game = () => {
  const { startLoop, stopLoop } = useBeatLoop();
  const [gameState, setGameState] = useState<States>(States.Landing);
  const [count, setCount] = useState(0);
  useEffect(() => {
    switch (gameState) {
      case States.TestingControls:
        document.documentElement.addEventListener("keydown", (event) => {});

        break;

      default:
        break;
    }
  }, [gameState]);
  const tap = () => {
    setCount((lastCount) => lastCount + 1);
  };
  const start = () => {
    setCount(0);
    setGameState(States.TestingControls);
    startLoop();
  };

  switch (gameState) {
    case States.Landing:
      return (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-8xl">Got Rhythm?</h1>
          <audio src="/beat.wav" loop></audio>
          <button onClick={start}>
            <FontAwesomeIcon size="2x" icon={faPlay} />
          </button>
        </div>
      );
      break;
    case States.TestingControls:
      return (
        <div className="flex flex-col items-center gap-2">
          {count < 8 ? (
            <>
              <p>tap along to the beat</p>
              <div className="flex flex-row gap-3">
                <FontAwesomeIcon size="lg" icon={faComputerMouse} />
                <FontAwesomeIcon size="lg" icon={faKeyboard} />
              </div>
            </>
          ) : (
            <div>{count}</div>
          )}
        </div>
      );
    case States.WarmUp:

    case States.InGame:
    case States.Results:
    default:
      break;
  }

  return (
    <>
      <p>testse</p>
    </>
  );
};

function App() {
  const { darkMode, setLightMode, setDarkMode } = useDarkMode();
  const [parent, enableAnimations] = useAutoAnimate();
  return (
    <main
      ref={parent as React.RefObject<HTMLElement>}
      className="mt-5 flex w-full flex-col items-center gap-2"
    >
      <menu className="mr-5 self-end">
        {darkMode ? (
          <button onClick={setLightMode}>
            <FontAwesomeIcon icon={faSun} />
          </button>
        ) : (
          <button onClick={setDarkMode}>
            <FontAwesomeIcon icon={faMoon} />
          </button>
        )}
      </menu>
      <Game />
    </main>
  );
}

export default App;
