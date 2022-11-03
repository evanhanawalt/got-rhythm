import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";

function App() {
  const [state, send] = useMachine(
    createMachine({
      id: "game",
      initial: "loaded",
      states: {
        loaded: { on: { START_GAME: "testControls" } },
        testControls: { on: { END_TEST_CONTROLS: "warmup" } },
        warmup: { on: { END_WARMUP: "game" } },
        game: { on: { END_GAME: "results" } },
        results: { on: { TRY_AGAIN: "warmup" } },
      },
    })
  );

  return (
    <main className="w-full bg-black h-[100vh] text-white flex flex-col items-start gap-2">
      <p>{`State: ${state.value}`}</p>
      <button onClick={() => send("START_GAME")}>START_GAME</button>
      <button onClick={() => send("END_TEST_CONTROLS")}>
        END_TEST_CONTROLS
      </button>
      <button onClick={() => send("END_WARMUP")}>END_WARMUP</button>
      <button onClick={() => send("END_GAME")}>END_GAME</button>
      <button onClick={() => send("TRY_AGAIN")}>TRY_AGAIN</button>
    </main>
  );
}

export default App;
