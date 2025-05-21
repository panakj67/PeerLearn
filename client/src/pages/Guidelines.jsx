import React from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaDownload, FaExclamationCircle, FaCheckCircle, FaImage, FaFilePdf } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const UploadGuidelines = () => {
  return (
    <div
      className="px-8 py-16 w-full my-10 mx-auto bg-gradient-to-r from-blue-100/40 to-white rounded-lg"
    >
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">Upload Guidelines</h1>

      {/* General Introduction */}
      <div className="text-lg text-gray-800 mb-12 text-center">
        <p className="leading-relaxed">
          Welcome to the peer-to-peer learning platform! Here’s how you can upload your study materials and help others learn while benefiting from shared knowledge.
        </p>
      </div>

      {/* File Upload Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          {/* General Guidelines */}
          <div className="flex items-center space-x-4">
            <FaFileAlt className="text-3xl text-blue-600" />
            <h2 className="text-2xl font-semibold text-blue-700">General Guidelines</h2>
          </div>
          <ul className="list-disc ml-8 text-gray-700">
            <li>Ensure the material is relevant and academic in nature.</li>
            <li>Content should be well-organized and easy to understand.</li>
            <li>Ensure the document is properly formatted (images, charts, etc.).</li>
            <li>Materials should be your own work or properly cited.</li>
          </ul>

          {/* File Format */}
          <div className="flex items-center space-x-4">
            <FaFilePdf className="text-3xl text-blue-600" />
            <h2 className="text-2xl font-semibold text-blue-700">File Format</h2>
          </div>
          <ul className="list-disc ml-8 text-gray-700">
            <li>Supported file formats: PDF, DOCX, PPTX, JPG.</li>
            <li>For images, make sure they are high-quality and readable.</li>
            <li>Ensure that presentations are clear with readable fonts.</li>
          </ul>
        </div>

        {/* Content Restrictions & How to Upload */}
        <div className="space-y-6">
          {/* Content Restrictions */}
          <div className="flex items-center space-x-4">
            <FaExclamationCircle className="text-3xl text-red-600" />
            <h2 className="text-2xl font-semibold text-blue-700">Content Restrictions</h2>
          </div>
          <ul className="list-disc ml-8 text-gray-700">
            <li>No plagiarized or copyrighted content. Upload your original work.</li>
            <li>Avoid offensive, harmful, or inappropriate content.</li>
            <li>No spam or unrelated materials.</li>
          </ul>

          {/* How to Upload */}
          <div className="flex items-center space-x-4">
            <FaDownload className="text-3xl text-green-600" />
            <h2 className="text-2xl font-semibold text-blue-700">How to Upload</h2>
          </div>
          <ol className="list-decimal ml-8 text-gray-700">
            <li>Log in to your account on the platform.</li>
            <li>Navigate to the "Upload" section from your dashboard.</li>
            <li>Click on "Choose File" to select your document or image.</li>
            <li>Add a title and description (course name, subject, etc.).</li>
            <li>Click "Submit" to complete the upload.</li>
          </ol>
        </div>
      </div>

      {/* Benefits of Uploading */}
      <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl font-semibold text-blue-700">Why Upload?</h2>
        <p className="text-lg text-gray-700">
          By sharing your notes, you’re helping other students while also earning points that you can use to download other valuable resources. It’s a win-win!
        </p>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <button
        onClick={() => window.location.href = '/upload'}
         className="px-12 py-3 cursor-pointer rounded-full bg-blue-600 text-white text-lg hover:bg-blue-700 transition-all ease-in-out">
          Start Uploading Your Notes
        </button>
      </div>
    </div>
  );
};

export default UploadGuidelines;
