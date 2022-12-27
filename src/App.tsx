import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  faPlay,
  faComputerMouse,
  faKeyboard,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useDarkMode } from "./useDarkMode";
import { useGameState } from "./useGameState";

const Game = () => {
  const { startGame, count, resultsDisplay } = useGameState();
  if (count === 123123) {
    return (
      <>
        <h1 className="text-8xl">Got Rhythm?</h1>
        <audio src="/beat.wav" loop></audio>
        <button onClick={startGame}>
          <FontAwesomeIcon size="2x" icon={faPlay} />
        </button>
      </>
    );
  } else if (count < -12) {
    return (
      <>
        <p>tap along to the beat</p>
        <div className="flex flex-row gap-3">
          <FontAwesomeIcon size="lg" icon={faComputerMouse} />
          <FontAwesomeIcon size="lg" icon={faKeyboard} />
        </div>
      </>
    );
  } else if (count < -6) {
    return <div>good, now try it on your own</div>;
  } else if (count < 0) {
    return <div>the beat will fade out in... {Math.abs(count)}</div>;
  } else if (count < 20) {
    return <div>Gaming</div>;
  } else {
    return (
      <>
        <div>Results</div>
        {resultsDisplay !== undefined ? (
          <>
            <p>Score {resultsDisplay.score}</p>
            {resultsDisplay.diffs.map((num) => (
              <p>{num}</p>
            ))}
          </>
        ) : null}
      </>
    );
  }
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
        <button onClick={darkMode ? setLightMode : setDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </menu>
      <div className="flex flex-col items-center gap-2">
        <Game />
      </div>
    </main>
  );
}

export default App;
