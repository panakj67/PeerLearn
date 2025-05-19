import React from 'react';
import { FaUsers, FaChalkboardTeacher, FaHandsHelping, FaRocket } from 'react-icons/fa';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-10">About PeerLearn</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <FaUsers size={40} className="text-indigo-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Community Driven</h2>
            <p className="text-gray-600 mt-1">PeerLearn is built on the idea of collaborative learning. Students help each other by sharing valuable study materials, notes, and solutions.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <FaChalkboardTeacher size={40} className="text-green-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Learn from Peers</h2>
            <p className="text-gray-600 mt-1">Access study content prepared by fellow students who understand your syllabus, struggles, and academic needs.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <FaHandsHelping size={40} className="text-yellow-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Help and Get Help</h2>
            <p className="text-gray-600 mt-1">Earn points for uploading and use them to download resources. Everyone contributes, and everyone benefits.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <FaRocket size={40} className="text-orange-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Boost Your Learning</h2>
            <p className="text-gray-600 mt-1">Get access to high-quality, peer-reviewed study materials and boost your exam preparation with ease.</p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
        <p className="text-gray-600 max-w-3xl mx-auto">We aim to create an academic ecosystem where students uplift each other by sharing knowledge. With PeerLearn, you're not just studying — you're contributing to a smarter, more connected academic community.</p>
      </div>
    </div>
  );
};

export default About;
