import { ResultsDisplay } from "./useGameState";

const ResultsChart = ({ results }: { results: ResultsDisplay }) => {
  return (
    <>
      <h1 className="text-3xl">You Scored: {results.score}</h1>
      <h1 className="text-xl">Out of 1000</h1>
      <svg
        height={500}
        className="w-full max-w-[700px] overflow-visible fill-black stroke-black p-5 pb-8 text-black dark:fill-white dark:stroke-white dark:text-white"
      >
        <text textAnchor="start" y={12} className="stroke-none">
          Too Early
        </text>
        <text textAnchor="end" x={"100%"} y={12} className="stroke-none">
          Too Late
        </text>
        <text textAnchor="middle" x={"50%"} y={12} className="stroke-none">
          Perfect
        </text>
        <line
          x1={"50%"}
          x2={"50%"}
          y1={20}
          y2={"100%"}
          className="opacity-30"
        />
        <line
          x1={"100%"}
          x2={"100%"}
          y1={20}
          y2={"100%"}
          className="opacity-30"
        />
        <line x1={0} x2={0} y1={20} y2={"100%"} className="opacity-30" />
        {results.diffs.map(({ isEarly, points }, index) => {
          let [start, end] = isEarly
            ? [`${50 - (50 - points)}%`, "50%"]
            : ["50%", `${100 - points}%`];
          let circleX = isEarly ? start : end;
          let y = 30 + 21 * index;
          return (
            <g
              key={index}
              onMouseEnter={(e) => {
                e.currentTarget.firstElementChild?.setAttribute("r", "12");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.firstElementChild?.setAttribute("r", "6");
              }}
            >
              <circle
                cx={circleX}
                cy={y}
                r="8"
                className="transform fill-black dark:fill-white"
              />
              <line x1={start} x2={end} y1={y} y2={y} />
              <text
                textAnchor="middle"
                x={circleX}
                y={y + 6}
                className="cursor-default fill-white stroke-none text-white opacity-0 transition-opacity duration-300 hover:opacity-100 dark:fill-black dark:text-black"
              >
                {points}
              </text>
            </g>
          );
        })}
        <text textAnchor="start" y={"104%"} className="stroke-none">
          0 pts
        </text>
        <text textAnchor="end" x={"100%"} y={"104%"} className="stroke-none">
          0 pts
        </text>
        <text textAnchor="middle" x={"50%"} y={"104%"} className="stroke-none">
          50 pts
        </text>
      </svg>
    </>
  );
};
export default ResultsChart;
