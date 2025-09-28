import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image to Sketch Converter',
  description: 'Convert your images to beautiful black and white sketches using AI',
};

export default function ImageToSketchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header placeholder */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            AI Image to Sketch Converter
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Image to Sketch Converter
            </h1>
            <p className="text-lg text-gray-600">
              Upload your image and let Gemini AI create a beautiful black and white sketch for you.
            </p>
          </div>

          {/* Placeholder content - will be replaced with actual components in later steps */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-500">
              <p className="text-xl mb-4">🚧 Under Construction</p>
              <p>Image to Sketch functionality will be implemented in the next steps.</p>
              <p className="text-sm mt-4">Route: <code className="bg-gray-100 px-2 py-1 rounded">/[locale]/image-to-sketch</code></p>
            </div>
          </div>
        </div>
      </main>

      {/* Simple footer placeholder */}
      <footer className="bg-white mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Powered by Google Gemini API</p>
        </div>
      </footer>
    </div>
  );
}