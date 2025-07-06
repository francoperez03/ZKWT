import React from 'react';
import { Group } from '@semaphore-protocol/group';
import type { SimpleStepProps } from './types';

const Step1CreateGroup: React.FC<SimpleStepProps> = ({ state, onStateChange, onError }) => {
  const createGroup = () => {
    try {
      const newGroup = new Group();
      const newState = { ...state, group: newGroup, isMember: false, proof: null };
      onStateChange(newState);
      onError(''); // Limpiar errores
    } catch (error) {
      onError(`Error creando grupo: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">1. Crear Grupo</h3>
      <button
        onClick={createGroup}
        className="w-full py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        {state.group ? 'Crear Nuevo Grupo' : 'Crear Grupo'}
      </button>
      {state.group && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-sm">
            <div className="font-medium text-green-800">Grupo Creado ✓</div>
            <div className="text-green-700 mt-1">
              <strong>Miembros:</strong> {state.group.members.length}
            </div>
            <div className="text-green-700 mt-1">
              <strong>Root Hash:</strong> {state.group.root.toString().slice(0, 40)}...
            </div>
            <div className="text-green-700 mt-1">
              <strong>Depth:</strong> {state.group.depth}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1CreateGroup; 