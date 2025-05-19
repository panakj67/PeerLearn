import React from "react";
import { BadgeCheck, Lock } from "lucide-react";

const badges = [
  { id: 1, name: "First Upload", earned: true, description: "Uploaded your first note" },
  { id: 2, name: "Top Contributor", earned: false, description: "Uploaded 20+ notes" },
  { id: 3, name: "Community Helper", earned: true, description: "Received 10 upvotes" },
  { id: 4, name: "Speedy Uploader", earned: false, description: "Uploaded within 5 minutes" },
  { id: 5, name: "Verified Scholar", earned: false, description: "Earned 500 points" },
];

const BadgesSection = () => {
  return (
    <div className="mt-16 bg-gradient-to-br from-white to-purple-50 border-t-2 border-gray-400/10 p-10 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">🏅 Achievements & Badges</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl border ${
              badge.earned ? "bg-blue-50 border-blue-300" : "bg-gray-100 border-gray-300"
            } flex flex-col items-center justify-center text-center shadow-sm`}
          >
            <div className="text-4xl mb-2">
              {badge.earned ? (
                <BadgeCheck className="text-green-500 w-8 h-8" />
              ) : (
                <Lock className="text-gray-500 w-8 h-8" />
              )}
            </div>
            <p className="font-semibold text-lg">{badge.name}</p>
            <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesSection;
