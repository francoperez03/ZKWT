import React from 'react';
import { Identity } from '@semaphore-protocol/identity';
import type { SimpleStepProps } from './types';
import { getIdentitySecret } from './utils';

const Step2CreateIdentity: React.FC<SimpleStepProps> = ({ state, onStateChange, onError }) => {
  const createIdentity = () => {
    try {
      const newIdentity = new Identity();
      const newState = { ...state, identity: newIdentity, isMember: false, proof: null };
      onStateChange(newState);
      onError(''); // Limpiar errores
    } catch (error) {
      onError(`Error creando identidad: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">2. Crear Identidad</h3>
      <button
        onClick={createIdentity}
        className="w-full py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        {state.identity ? 'Crear Nueva Identidad' : 'Crear Identidad'}
      </button>
      {state.identity && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-sm">
            <div className="font-medium text-green-800">Identidad Creada ✓</div>
            <div className="text-green-700 mt-1">
              <strong>Commitment:</strong> 
              <div className="font-mono text-xs mt-1 break-all bg-gray-800 text-white p-2 rounded">
                {state.identity.commitment.toString()}
              </div>
            </div>
            <div className="text-green-700 mt-1">
              <strong>Estado Serializado:</strong> 
              <div className="font-mono text-xs mt-1 break-all bg-gray-800 text-white p-2 rounded">
                {JSON.stringify({
                  identity: state.identity ? {
                    commitment: state.identity.commitment.toString(),
                    secret: getIdentitySecret(state.identity)
                  } : null,
                  group: state.group ? {
                    members: state.group.members.map(m => m.toString()),
                    root: state.group.root.toString()
                  } : null,
                  isMember: state.isMember,
                  proof: state.proof ? 'Prueba ZK generada' : null
                }, null, 2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2CreateIdentity; 