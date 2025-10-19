
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 pb-2">
        Reunify
      </h1>
      <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
        Reconnect with your past. Upload a childhood and a recent photo to create a unique, AI-generated "then and now" image.
      </p>
    </header>
  );
};
