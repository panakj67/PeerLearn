import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Aman", points: 240 },
  { name: "Priya", points: 220 },
  { name: "Rahul", points: 200 },
  { name: "Sneha", points: 180 },
  { name: "You", points: 195 },
];

const Leaderboard = () => {
  return (
    <div
      className="bg-gradient-to-br from-blue-100/20 to-blue-50/20 text-gray-900 rounded-3xl p-10 w-full max-w-6xl mx-auto my-16 shadow-xl"
    >
      <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-600 drop-shadow-md">
        🏆 Game Leaderboard
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-yellow-200">
          <thead className="bg-blue-300/50 text-yellow-900 text-xl font-semibold">
            <tr>
              <th className="py-4 px-6 text-left">Rank</th>
              <th className="py-4 px-6 text-left">Player</th>
              <th className="py-4 px-6 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player, index) => (
              <tr
                key={player.name}
                className={`transition duration-300 hover:bg-blue-100/40 cursor-pointer ${
                  player.name === "You" ? "bg-cyan-100" : ""
                }`}
              >
                <td className="py-4 px-6 text-xl">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && (
                    <span className="text-gray-500 font-semibold">#{index + 1}</span>
                  )}
                </td>
                <td className="py-4 px-6 flex items-center space-x-4 text-lg">
                  {/* Avatar initials circle */}
                  <div className="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md">
                    {player.name.charAt(0)}
                  </div>
                  <span className={player.name === "You" ? "text-cyan-600 font-bold" : ""}>
                    {player.name}
                    {player.name === "You" && (
                      <span className="ml-2 bg-cyan-600 text-white text-xs px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-4 px-6 text-yellow-600 font-semibold text-lg">
                  {player.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center text-sm text-gray-700">
        You are currently ranked{" "}
        <span className="text-yellow-600 font-bold text-lg">
          #{data.findIndex((u) => u.name === "You") + 1}
        </span>{" "}
        out of {data.length} players.
      </div>
    </div>
  );
};

export default Leaderboard;
