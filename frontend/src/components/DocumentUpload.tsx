"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Upload, RefreshCw, Info } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";

// Import local assets
import passportImage from "@/assets/passport.png";
import panImage from "@/assets/pan.png";
import aadhaarImage from "@/assets/aadhaar.jpg";

export default function DocumentUpload() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedLocalAsset] = useState<string | null>(null);

  const localAssets = [
    { name: "Passport", image: passportImage },
    { name: "PAN Card", image: panImage },
    { name: "Aadhaar Card", image: aadhaarImage },
  ];

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);

    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (processedImage) URL.revokeObjectURL(processedImage);
    };
  }, []);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setIsProcessed(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/process-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const processedImageBlob = new Blob([response.data], {
        type: "image/png",
      });
      const processedImageUrl = URL.createObjectURL(processedImageBlob);

      setProcessedImage(processedImageUrl);
      setIsProcessing(false);
      setIsProcessed(true);
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try again.");
      setIsProcessing(false);
      setIsProcessed(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage(URL.createObjectURL(file));
      await processImage(file);
    }
  };

  const handleLocalAssetSelect = async (assetPath: string) => {
    try {
      // Fetch the image as a file
      const response = await fetch(assetPath);
      const blob = await response.blob();
      const file = new File([blob], "local_asset.png", { type: blob.type });

      setOriginalImage(assetPath);
      setSelectedLocalAsset(assetPath);
      await processImage(file);
    } catch (err) {
      console.error("Error processing local asset:", err);
      setError("Failed to process local asset. Please try again.");
    }
  };

  const resetUpload = () => {
    if (originalImage) URL.revokeObjectURL(originalImage);
    if (processedImage) URL.revokeObjectURL(processedImage);

    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessed(false);
    setError(null);
    setSelectedLocalAsset(null);
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = "anonymized_document.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section
      id="upload"
      className="min-h-screen mt-8 bg-transparent flex items-center justify-center transition-colors duration-300 relative"
    >
      <div className="max-w-4xl w-full p-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8"
        >
          Anonymize Your Documents
        </motion.h2>

        {/* Local Assets Information */}
        {!originalImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-6 bg-blue-50 dark:bg-neutral-800 p-4 rounded-lg border border-blue-200 dark:border-neutral-700"
          >
            <div className="flex justify-center items-center mb-2">
              <Info className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                Trial Documents
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto">
              These are sample images you can use to test the document
              anonymization feature. They are pre-loaded example documents to
              help you understand how the anonymization process works without
              uploading your own sensitive files.
            </p>
          </motion.div>
        )}

        {/* Local Assets Selection */}
        {!originalImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center space-x-4 mb-6"
          >
            {localAssets.map((asset) => (
              <button
                key={asset.name}
                onClick={() => handleLocalAssetSelect(asset.image)}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition duration-300"
              >
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-24 h-24 object-cover rounded-lg mb-2"
                />
                <span className="text-sm">{asset.name}</span>
              </button>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`bg-gray-100 dark:bg-neutral-900 border-4 border-dashed rounded-lg p-8 relative z-20 ${
            isDarkMode ? "border-neutral-700" : "border-gray-300"
          }`}
        >
          {!originalImage ? (
            <FileUpload onChange={handleFileUpload} />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative z-30">
                <h3 className="text-xl font-semibold mb-4">Original Image</h3>
                <img
                  src={originalImage}
                  alt="Uploaded document"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="relative z-30">
                <h3 className="text-xl font-semibold mb-4">Anonymized Image</h3>
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : processedImage ? (
                  <>
                    <img
                      src={processedImage}
                      alt="Anonymized document"
                      className="w-full rounded-lg shadow-lg"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full z-40"
                    >
                      <Check className="h-6 w-6" />
                    </motion.div>
                  </>
                ) : error ? (
                  <div className="text-red-500 text-center">{error}</div>
                ) : null}
              </div>
            </div>
          )}
        </motion.div>

        {(isProcessed || error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex justify-center items-center space-x-4 relative z-50"
          >
            {processedImage && (
              <button
                onClick={downloadImage}
                className={`flex items-center bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300 ${
                  isDarkMode ? "dark:bg-green-500 dark:hover:bg-green-600" : ""
                }`}
              >
                <Upload className="mr-2 h-5 w-5" /> Download Anonymized Document
              </button>
            )}
            <button
              onClick={resetUpload}
              className={`flex items-center bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300 ${
                isDarkMode ? "dark:bg-purple-500 dark:hover:bg-purple-600" : ""
              }`}
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Process Another Document
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
