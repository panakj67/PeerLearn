import React from 'react';
import { FaUpload, FaDownload, FaStar, FaUserFriends } from 'react-icons/fa';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: <FaUpload size={40} className="text-purple-600" />,
    title: 'Upload Your Notes',
    description: 'Share your valuable notes, assignments, and past papers. Ensure they are clear and helpful so they benefit others.'
  },
  {
    icon: <FaStar size={40} className="text-yellow-500" />,
    title: 'Earn Reward Points',
    description: 'Get rewarded with points for every approved upload. The better the content, the more you earn.'
  },
  {
    icon: <FaDownload size={40} className="text-blue-600" />,
    title: 'Download Anytime',
    description: 'Use your points to unlock and download high-quality study material shared by fellow students.'
  },
  {
    icon: <FaUserFriends size={40} className="text-green-600" />,
    title: 'Grow with the Community',
    description: 'Be part of a thriving learning ecosystem. Connect, collaborate, and grow with students across colleges.'
  }
];

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 
        className="text-4xl font-bold  text-center text-blue-700 mb-14"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        How It Works
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-6 shadow-sm rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="shrink-0">{step.icon}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{step.title}</h2>
              <p className="text-gray-600  leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h3 
          className="text-3xl font-semibold text-gray-800 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Step-by-Step Guide
        </h3>

        <ol 
          className="text-left list-decimal list-inside text-gray-700 max-w-3xl mx-auto space-y-4 bg-white rounded-xl p-8 border border-gray-200 shadow-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <li>Register using your verified college email ID.</li>
          <li>Navigate to the Upload section and submit your content.</li>
          <li>Our team reviews and approves quality uploads.</li>
          <li>Earn points credited to your profile.</li>
          <li>Use those points to download notes, papers, or assignments.</li>
          <li>Help others, grow your points, and unlock more resources.</li>
        </ol>
      </div>
    </div>
  );
};

export default HowItWorks;
