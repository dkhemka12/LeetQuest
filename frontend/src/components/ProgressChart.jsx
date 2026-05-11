import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const defaultData = [
    { name: "Easy", solved: 0 },
    { name: "Medium", solved: 0 },
    { name: "Hard", solved: 0 },
];

const ProgressChart = ({ data = defaultData }) => {
    return (
        <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-text-main">Problem Mix</h2>
            <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="name" stroke="#8a8a8a" />
                        <YAxis stroke="#8a8a8a" />
                        <Tooltip />
                        <Bar dataKey="solved" fill="#ffa116" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </article>
    );
};

export default ProgressChart;
