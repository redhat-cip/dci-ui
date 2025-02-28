import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { IJobStat } from "./jobStats";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        <p
          style={{ color: p.fill }}
        >{`${p.label}: ${p.value}% (${p.total})`}</p>
      </div>
    );
  }

  return null;
};

const RADIAN = Math.PI / 180;

const CustomLabel: React.FC<PieLabelRenderProps> = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}) => {
  const cxN = Number(cx);
  const inner = Number(innerRadius);
  const outer = Number(outerRadius);
  const radius = inner + (outer - inner) * 0.5;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 4 / 100) return null;
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cxN ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function JobStatChart({
  name,
  stat,
}: {
  name: string;
  stat: IJobStat;
}) {
  const nbJobs = Object.values(stat).reduce((acc, status) => {
    acc += status.total;
    return acc;
  }, 0);
  const data = Object.values(stat).map((status) => {
    if (nbJobs === 0) return { ...status, value: 0 };
    return { ...status, value: Math.round((status.total * 100) / nbJobs) };
  });
  return (
    <div>
      <div>
        <ResponsiveContainer height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div>{`${nbJobs} job${nbJobs > 1 ? "s" : ""}`} </div>
        <div className="pf-v6-u-font-size-xl">{name}</div>
      </div>
    </div>
  );
}
