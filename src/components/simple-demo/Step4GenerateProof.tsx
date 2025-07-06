import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { generateProof as generateProofNoir } from '@semaphore-noir/proof';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { generateProof as generateProofProtocol } from '@semaphore-protocol/proof';
import type { SimpleStepProps } from './types';
import { getIdentitySecret } from './utils';

const Step4GenerateProof: React.FC<SimpleStepProps> = ({ state, onStateChange, onError }) => {
  // Usar los valores del estado o valores por defecto
  const signal = state.signal || 'Voto_A';
  const externalNullifier = state.externalNullifier || 'eleccion_presidente_2024';
  
  // Función para actualizar signal en el estado
  const setSignal = (newSignal: string) => {
    const newState = { ...state, signal: newSignal };
    onStateChange(newState);
  };
  
  // Función para actualizar externalNullifier en el estado
  const setExternalNullifier = (newNullifier: string) => {
    const newState = { ...state, externalNullifier: newNullifier };
    onStateChange(newState);
  };
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [parametersView, setParametersView] = useState<string>('');

  // Función para mostrar/ocultar los parámetros completos
  const displayParameters = () => {
    if (parametersView) {
      // Si ya están mostrados, ocultarlos
      setParametersView('');
      return;
    }

    if (!state.group || !state.identity) {
      setParametersView('Grupo e identidad deben estar creados primero');
      return;
    }

    const identitySecret = getIdentitySecret(state.identity);
    const groupMembers = state.group.members.map((member, index) => 
      `  [${index}]: ${member.toString()}`
    ).join('\n');

    const params = `PARÁMETROS PARA GENERAR PRUEBA ZK:

1. IDENTITY (Identidad):
   - Commitment: ${state.identity.commitment.toString()}
   - Secret: ${identitySecret}

2. GROUP (Grupo):
   - Depth: ${state.group.depth}
   - Size: ${state.group.size}
   - Root: ${state.group.root.toString()}
   - Members (${state.group.members.length}):
${groupMembers}

3. SIGNAL (Mensaje):
   - Valor: "${signal}"
   - Tipo: ${typeof signal}
   - Longitud: ${signal.length} caracteres

4. EXTERNAL NULLIFIER (Nullificador):
   - Valor: "${externalNullifier}"
   - Tipo: ${typeof externalNullifier}
   - Longitud: ${externalNullifier.length} caracteres

5. VERIFICACIÓN MEMBRESÍA:
   - Identidad está en grupo: ${state.isMember ? 'SÍ' : 'NO'}
   - Índice en grupo: ${state.group.members.findIndex(
     member => member.toString() === state.identity!.commitment.toString()
   )}`;

    setParametersView(params);
  };

  const generateZKProof = async (useProtocol: boolean = false) => {
    if (!state.group || !state.identity || !state.isMember) return;

    setIsGeneratingProof(true);
    onError(''); // Limpiar errores previos
    
    try {
      // Verificar que la identidad esté en el grupo
      const identityIndex = state.group.members.findIndex(
        member => member.toString() === state.identity!.commitment.toString()
      );
      
      if (identityIndex === -1) {
        throw new Error('La identidad no está en el grupo. Esto puede suceder si se recargó la página o hubo un error de sincronización.');
      }

      const libraryName = useProtocol ? '@semaphore-protocol/proof' : '@semaphore-noir/proof';
      
      // Log para debug
      console.log(`Generando prueba ZK con ${libraryName}:`);
      console.log('- Identity secret:', getIdentitySecret(state.identity));
      console.log('- Group members:', state.group.members.length);
      console.log('- Signal:', signal);
      console.log('- External nullifier:', externalNullifier);

      // Usar la librería correspondiente
      const generateProofFn = useProtocol ? generateProofProtocol : generateProofNoir;
      
      const proof = await generateProofFn(
        state.identity,
        state.group,
        signal,
        externalNullifier
      );
      
      console.log(`✅ Prueba ZK generada exitosamente con ${libraryName}:`, proof);
      const newState = { 
        ...state, 
        proof: proof, // Almacenar la prueba completa
        signal: signal, // Almacenar el signal usado
        externalNullifier: externalNullifier, // Almacenar el nullifier usado
        proofVerified: null // Resetear verificación
      };
      onStateChange(newState);
    } catch (error) {
      console.error('Error generating proof:', error);
      const libraryName = useProtocol ? '@semaphore-protocol/proof' : '@semaphore-noir/proof';
      
      // Capturar el error completo para mostrar al usuario
      const errorDetails = error instanceof Error ? error.message : String(error);
      const fullError = `Error generando la prueba ZK con ${libraryName}:

Detalles técnicos:
${errorDetails}

Stack trace:
${error instanceof Error && error.stack ? error.stack : 'No disponible'}

Parámetros utilizados:
- Signal: "${signal}"
- External Nullifier: "${externalNullifier}"
- Grupo tiene ${state.group?.members.length || 0} miembros
- Identidad commitment: ${state.identity?.commitment.toString().slice(0, 30)}...

Posibles causas:
1. La identidad no está correctamente agregada al grupo
2. Parámetros inválidos en signal o nullifier
3. Error en la librería ${libraryName}
4. Problema con el árbol de Merkle del grupo`;
      
      onError(fullError);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">4. Generar Prueba ZK</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Signal (tu mensaje/voto anónimo):
          </label>
          <input
            type="text"
            value={signal}
            onChange={(e) => setSignal(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: Voto_A, Respuesta_SI, Opinion_Favorable"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Nullifier (identificador único del contexto):
          </label>
          <input
            type="text"
            value={externalNullifier}
            onChange={(e) => setExternalNullifier(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: eleccion_2024, encuesta_satisfaccion_Q1"
          />
        </div>

        {/* Botón para mostrar parámetros */}
        <button
          onClick={displayParameters}
          disabled={!state.group || !state.identity}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mb-3 ${
            !state.group || !state.identity
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
          }`}
        >
          {parametersView ? 'Ocultar Parámetros' : 'Mostrar Parámetros Completos'}
        </button>

        {/* Campo de texto para mostrar parámetros */}
        {parametersView && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Parámetros Completos:
            </label>
            <textarea
              value={parametersView}
              readOnly
              className="w-full p-3 border rounded bg-white font-mono text-sm text-gray-800 resize-y border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={20}
              style={{ minHeight: '300px' }}
            />
          </div>
        )}

        {/* Botones para generar prueba con cada librería */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => generateZKProof(false)}
            disabled={!state.isMember || isGeneratingProof}
            className={`py-3 px-4 rounded-lg font-medium transition-colors ${
              !state.isMember
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isGeneratingProof
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
            }`}
          >
            {!state.isMember
              ? 'Agrega identidad primero'
              : isGeneratingProof
              ? 'Generando...'
              : 'Generar con @semaphore-noir/proof'
            }
          </button>

          <button
            onClick={() => generateZKProof(true)}
            disabled={!state.isMember || isGeneratingProof}
            className={`py-3 px-4 rounded-lg font-medium transition-colors ${
              !state.isMember
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isGeneratingProof
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
            }`}
          >
            {!state.isMember
              ? 'Agrega identidad primero'
              : isGeneratingProof
              ? 'Generando...'
              : 'Generar con @semaphore-protocol/proof'
            }
          </button>
        </div>
      </div>

      {/* Resultado de la Prueba */}
      {state.proof && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold mb-2 text-green-800">Prueba ZK Generada ✓</h4>
          <div className="text-sm space-y-2 text-green-800">
            <div><strong>Signal:</strong> {state.signal}</div>
            <div><strong>Nullifier:</strong> {state.externalNullifier}</div>
            <div><strong>Merkle Root:</strong> {state.proof.merkleTreeRoot?.slice(0, 20)}...</div>
            <div><strong>Nullifier Hash:</strong> {state.proof.nullifier?.slice(0, 20)}...</div>
            <div className="text-xs text-gray-600">
              La prueba demuestra que tu identidad pertenece al grupo sin revelar cuál es.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4GenerateProof; 