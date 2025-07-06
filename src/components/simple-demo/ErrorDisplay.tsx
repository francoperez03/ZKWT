import React from 'react';

interface ErrorDisplayProps {
  errorMessage: string;
  onClearError: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, onClearError }) => {
  if (!errorMessage) return null;

  return (
    <div className="border rounded-lg p-4 bg-red-50 border-red-200">
      <h3 className="font-semibold mb-3 text-red-800">❌ Error en la Generación de Prueba</h3>
      <textarea
        value={errorMessage}
        readOnly
        className="w-full h-96 p-3 text-xs font-mono bg-gray-800 text-white rounded resize-y"
        placeholder="Los detalles del error aparecerán aquí..."
      />
      <button
        onClick={onClearError}
        className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Limpiar Error
      </button>
    </div>
  );
};

export default ErrorDisplay; 