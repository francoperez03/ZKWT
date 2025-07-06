import React from 'react';
import type { SimpleStepProps } from './types';

const ControlButtons: React.FC<SimpleStepProps> = ({ state, onStateChange, onError }) => {
  // Re-sincronizar identidad con grupo
  const resyncIdentity = () => {
    if (!state.group || !state.identity) return;
    
    const identityInGroup = state.group.members.some(
      member => member.toString() === state.identity!.commitment.toString()
    );
    
    if (!identityInGroup) {
      // Agregar la identidad al grupo si no está
      state.group.addMember(state.identity.commitment);
    }
    
    const newState = { ...state, isMember: true, proof: null };
    onStateChange(newState);
    onError(''); // Limpiar errores
  };

  // Limpiar todo
  const clearAll = () => {
    const emptyState = {
      group: null,
      identity: null,
      isMember: false,
      proof: null
    };
    onStateChange(emptyState);
    localStorage.removeItem('simple-demo-state');
    onError(''); // Limpiar errores
  };

  return (
    <div className="border-t pt-4 space-y-2">
      {/* Botón de Re-sincronizar */}
      {state.group && state.identity && (
        <button
          onClick={resyncIdentity}
          className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          🔄 Re-sincronizar Identidad con Grupo
        </button>
      )}
      
      {/* Botón de Limpiar */}
      <button
        onClick={clearAll}
        className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Limpiar Todo
      </button>
    </div>
  );
};

export default ControlButtons; 