import React from 'react';
import { 
  Step1CreateGroup, 
  Step2CreateIdentity, 
  Step3AddToGroup, 
  Step4GenerateProof,
  ControlButtons,
  ErrorDisplay
} from './index';
import { useSimpleDemo } from './useSimpleDemo';

const SimpleDemoRefactored: React.FC = () => {
  const { state, errorMessage, updateState, handleError, clearError } = useSimpleDemo();

  const stepProps = {
    state,
    onStateChange: updateState,
    onError: handleError
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🔐 Simple Semaphore ZK Demo
        </h1>
        <p className="text-gray-600">
          Flujo simplificado para crear grupos, identidades y generar pruebas zero-knowledge
        </p>
      </div>

      {/* Pasos del flujo */}
      <div className="space-y-4">
        <Step1CreateGroup {...stepProps} />
        <Step2CreateIdentity {...stepProps} />
        <Step3AddToGroup {...stepProps} />
        <Step4GenerateProof {...stepProps} />
      </div>

      {/* Campo de Error - Ubicación prominente */}
      {errorMessage && (
        <div className="mt-6 mb-6">
          <ErrorDisplay 
            errorMessage={errorMessage} 
            onClearError={clearError} 
          />
        </div>
      )}

      {/* Botones de Control */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <ControlButtons {...stepProps} />
      </div>
    </div>
  );
};

export default SimpleDemoRefactored; 