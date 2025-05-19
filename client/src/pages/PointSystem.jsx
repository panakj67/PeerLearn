import React from 'react';
import { FaUpload, FaDownload, FaGift, FaCoins } from 'react-icons/fa';

const PointSystem = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-10">Point System</h1>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <FaUpload size={40} className="text-indigo-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Earn Points by Uploading</h2>
            <p className="text-gray-600 mt-1">Get <span className="font-bold text-indigo-600">+10 points</span> for each approved document upload. Ensure your content is clear, relevant, and properly formatted.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <FaDownload size={40} className="text-green-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Spend Points to Download</h2>
            <p className="text-gray-600 mt-1">Use <span className="font-bold text-green-600">5 points</span> to download any document uploaded by peers.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <FaGift size={40} className="text-yellow-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Bonus Points</h2>
            <p className="text-gray-600 mt-1">Earn <span className="font-bold text-yellow-600">+15 points</span> for being a top contributor weekly. Stay consistent and helpful!</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <FaCoins size={40} className="text-orange-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Referral Rewards</h2>
            <p className="text-gray-600 mt-1">Invite friends and earn <span className="font-bold text-orange-600">+20 points</span> when they upload their first document.</p>
          </div>
        </div>
      </section>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Points?</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">Points keep the platform fair and active. This peer-to-peer model ensures only valuable content circulates. Help others and benefit yourself — it's a win-win!</p>
      </div>
    </div>
  );
};

export default PointSystem;
