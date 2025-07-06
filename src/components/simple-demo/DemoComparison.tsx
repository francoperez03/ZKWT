import React, { useState } from 'react';
import SimpleDemo from '../SimpleDemo';
import SimpleDemoRefactored from './SimpleDemoRefactored';

const DemoComparison: React.FC = () => {
  const [activeVersion, setActiveVersion] = useState<'original' | 'refactored'>('refactored');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Selector de versión */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveVersion('refactored')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeVersion === 'refactored'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ✨ Simple (Refactorizada)
            </button>
            <button
              onClick={() => setActiveVersion('original')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeVersion === 'original'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📝 Original (Monolítica)
            </button>
          </div>
          
          {/* Información sobre la versión activa */}
          <div className="mt-3 text-sm text-gray-600">
            {activeVersion === 'refactored' ? (
              <div>
                <strong>✨ Simple (Refactorizada):</strong> Componentes modulares organizados en pasos separados con hooks personalizados - <em>Recomendada por defecto</em>
              </div>
            ) : (
              <div>
                <strong>📝 Original (Monolítica):</strong> Componente monolítico con toda la lógica en un solo archivo - <em>Para comparación</em>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="py-6">
        {activeVersion === 'refactored' ? (
          <SimpleDemoRefactored />
        ) : (
          <SimpleDemo />
        )}
      </div>
    </div>
  );
};

export default DemoComparison; 