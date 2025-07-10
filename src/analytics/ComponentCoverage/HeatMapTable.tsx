import { Link } from "react-router";
import { viridisFixedColor, type HeatMapMatrix } from "./heatMap";

export default function HeatMapTable({
  labelsY,
  labelsX,
  matrix,
  maxValue,
}: HeatMapMatrix) {
  const CELL_SIZE = 42;
  const LAST_COLUMN = labelsX.length + 2;
  const LAST_ROW = labelsY.length + 2;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `min-content repeat(${labelsX.length}, ${CELL_SIZE}px)`,
        gridTemplateRows: `auto repeat(${labelsY.length}, ${CELL_SIZE}px)`,
        overflow: "auto",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          width: "auto",
          gridArea: "1 / 1 / 2 / 2",
        }}
      />

      <div
        style={{
          display: "flex",
          overflow: "hidden",
          gridArea: `1 / 2 / 2 / ${LAST_COLUMN}`,
        }}
      >
        {labelsX.map((component) => (
          <div
            key={component.id}
            title={component.display_name}
            style={{
              width: `${CELL_SIZE}px`,
              display: "flex",
              alignItems: "center",
              padding: "1em 0",
              transform: "rotate(180deg)",
              writingMode: "vertical-rl",
              textAlign: "center",
            }}
          >
            <Link to={`/components/${component.id}`}>
              {component.display_name}
            </Link>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          gridArea: `2 / 1 / ${LAST_ROW} / 2`,
        }}
      >
        {labelsY.map((component) => (
          <div
            key={component.id}
            title={component.display_name}
            style={{
              height: `${CELL_SIZE}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: "0 1em",
            }}
          >
            <Link to={`/components/${component.id}`}>{component.display_name}</Link>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, ${CELL_SIZE}px)`,
          gridAutoRows: `${CELL_SIZE}px`,
          gridArea: `2 / 2 / ${LAST_ROW} / ${LAST_COLUMN}`,
          overflow: "auto",
          backgroundColor: "#f0f0f0",
        }}
      >
        {matrix.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            const bgColor = viridisFixedColor(value, maxValue);
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                style={{
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  textAlign: "center",
                  lineHeight: `${CELL_SIZE}px`,
                  fontSize: "0.75rem",
                  backgroundColor: bgColor,
                  color: "white",
                }}
                title={`(${labelsY[rowIdx].display_name}, ${labelsX[colIdx].display_name}): ${value}`}
              >
                {value > 0 ? value : ""}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
