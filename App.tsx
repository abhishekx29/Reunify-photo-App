
import React, { useState, useCallback } from 'react';
import type { UploadedFile } from './types';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImage } from './components/GeneratedImage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateReunifyImage } from './services/geminiService';

const App: React.FC = () => {
  const [childPhoto, setChildPhoto] = useState<UploadedFile | null>(null);
  const [adultPhoto, setAdultPhoto] = useState<UploadedFile | null>(null);
  const [prompt, setPrompt] = useState<string>(
    "Create a nostalgic, artistic photo that merges the person from the first image (child) with the person from the second image (adult), showing a beautiful 'then and now' effect. The style should be slightly faded and dreamlike."
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!childPhoto || !adultPhoto || !prompt) {
      setError("Please upload both photos and provide a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateReunifyImage(childPhoto, adultPhoto, prompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [childPhoto, adultPhoto, prompt]);
  
  const isButtonDisabled = !childPhoto || !adultPhoto || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader
              label="1. Childhood Photo"
              onImageUpload={setChildPhoto}
              id="child-photo"
            />
            <ImageUploader
              label="2. Recent Photo"
              onImageUpload={setAdultPhoto}
              id="adult-photo"
            />
          </div>
          
          <div className="mt-8">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
              3. Describe the image you want to create
            </label>
            <textarea
              id="prompt"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleGenerateClick}
              disabled={isButtonDisabled}
              className={`px-8 py-3 text-lg font-semibold rounded-full text-white transition-all duration-300
                ${isButtonDisabled 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/50'}`}
            >
              {isLoading ? 'Reunifying...' : 'Reunify Photos'}
            </button>
          </div>

          <div className="mt-10 min-h-[300px] flex items-center justify-center bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-4">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            {generatedImage && <GeneratedImage src={generatedImage} />}
            {!isLoading && !error && !generatedImage && (
              <p className="text-gray-500">Your generated image will appear here.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
