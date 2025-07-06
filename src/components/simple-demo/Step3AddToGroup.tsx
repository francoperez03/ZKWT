import React from 'react';
import type { SimpleStepProps } from './types';

const Step3AddToGroup: React.FC<SimpleStepProps> = ({ state, onStateChange, onError }) => {
  const addToGroup = () => {
    if (!state.group || !state.identity) return;

    try {
      state.group.addMember(state.identity.commitment);
      const newState = { ...state, isMember: true, proof: null };
      onStateChange(newState);
      onError(''); // Limpiar errores
    } catch (error) {
      onError(`Error agregando identidad al grupo: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const isIdentityInGroup = state.group && state.identity && 
    state.group.members.some(m => m.toString() === state.identity!.commitment.toString());

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">3. Agregar Identidad al Grupo</h3>
      <button
        onClick={addToGroup}
        disabled={!state.group || !state.identity || state.isMember}
        className={`w-full py-2 px-4 rounded ${
          !state.group || !state.identity
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : state.isMember
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {!state.group || !state.identity
          ? 'Crea grupo e identidad primero'
          : state.isMember
          ? 'Agregada al Grupo ✓'
          : 'Agregar al Grupo'
        }
      </button>
      
      {/* Información de estado actual */}
      {state.group && state.identity && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Membresía:</span>
              <span className={state.isMember ? 'text-green-600' : 'text-red-600'}>
                {state.isMember ? '✓ Agregada al grupo' : '✗ No agregada'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Verificación:</span>
              <span className={
                isIdentityInGroup ? 'text-green-600' : 'text-red-600'
              }>
                {isIdentityInGroup ? '✓ En grupo' : '✗ No verificada'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3AddToGroup; 