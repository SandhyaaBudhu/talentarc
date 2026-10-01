import { useId } from "react";
import { stages } from "../data";
import type { Candidate } from "../data";
export function ApplicationsChart({ period }: { period: string }) {
  const id = useId().replaceAll(":", "");
  const data =
    period === "Last 30 days"
      ? [22, 31, 26, 42, 34, 49, 46, 62, 52, 73, 61, 83]
      : period === "Last 3 months"
        ? [16, 24, 32, 25, 38, 43, 34, 48, 54, 68, 62, 83]
        : [12, 22, 18, 31, 38, 32, 44, 49, 39, 61, 67, 83];
  const points = data.map((value, i) => [48 + i * 47, 180 - value * 1.55]);
  const path = points
    .map((p, i) =>
      i === 0
        ? `M ${p[0]} ${p[1]}`
        : `C ${points[i - 1][0] + 23} ${points[i - 1][1]}, ${p[0] - 23} ${p[1]}, ${p[0]} ${p[1]}`,
    )
    .join(" ");
  const area = `${path} L 565 180 L 48 180 Z`;
  const labels =
    period === "Last 30 days"
      ? ["Sep 02", "Sep 07", "Sep 12", "Sep 17", "Sep 22", "Oct 01"]
      : period === "Last 3 months"
        ? ["Jul 01", "Jul 18", "Aug 05", "Aug 23", "Sep 10", "Oct 01"]
        : ["Nov", "Jan", "Mar", "May", "Jul", "Oct"];
  return (
    <div className="line-chart">
      <svg
        viewBox="0 0 600 224"
        role="img"
        aria-label={`Applications trend, ${period.toLowerCase()}, increasing from ${data[0]} to ${data.at(-1)} applications per period.`}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4b9d8e" stopOpacity=".2" />
            <stop offset="100%" stopColor="#4b9d8e" stopOpacity=".015" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <text
              x="27"
              y={185 - v * 1.55}
              textAnchor="end"
              className="axis-text"
            >
              {v}
            </text>
            <line
              x1="48"
              y1={180 - v * 1.55}
              x2="578"
              y2={180 - v * 1.55}
              className="chart-grid"
            />
          </g>
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path
          d="M48 169 C110 167 113 154 157 162 S244 148 287 150 S382 121 429 140 S518 115 565 124"
          fill="none"
          stroke="#c4ccd3"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <path d={path} fill="none" stroke="#368b7b" strokeWidth="2.8" />
        <circle
          cx="565"
          cy={points.at(-1)![1]}
          r="5"
          fill="#368b7b"
          stroke="var(--surface)"
          strokeWidth="3"
        />
        {labels.map((label, i) => (
          <text
            className="axis-text"
            x={48 + i * 104}
            y="212"
            key={label}
            textAnchor={i === 0 ? "start" : i === 5 ? "end" : "middle"}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
export function PipelineFunnel({ candidates }: { candidates: Candidate[] }) {
  const counts = stages.map(
    (s) => candidates.filter((c) => c.stage === s).length,
  );
  return (
    <div className="funnel-chart">
      {stages.map((stage, i) => (
        <div className="funnel-row" key={stage}>
          <div className="funnel-label">
            <span>
              <i
                style={{
                  background: [
                    "#326e61",
                    "#549984",
                    "#8fb6a2",
                    "#edba85",
                    "#e4a274",
                  ][i],
                }}
              />
              {stage}
            </span>
            <strong>
              {counts[i]}
              <small>
                {Math.round((counts[i] / Math.max(1, candidates.length)) * 100)}
                %
              </small>
            </strong>
          </div>
          <div className="funnel-track">
            <div
              style={{
                width: `${(counts[i] / Math.max(1, ...counts)) * 100}%`,
                background: [
                  "#326e61",
                  "#549984",
                  "#8fb6a2",
                  "#edba85",
                  "#e4a274",
                ][i],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
