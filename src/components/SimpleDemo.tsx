import React, { useState, useEffect } from 'react';
import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import { generateProof } from '@semaphore-noir/proof';

interface SimpleState {
  group: Group | null;
  identity: Identity | null;
  isMember: boolean;
  proof: string | null;
}

const SimpleDemo: React.FC = () => {
  const [state, setState] = useState<SimpleState>({
    group: null,
    identity: null,
    isMember: false,
    proof: null
  });
  
  const [signal, setSignal] = useState<string>('Voto_A');
  const [externalNullifier, setExternalNullifier] = useState<string>('eleccion_presidente_2024');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Cargar estado desde localStorage al iniciar
  useEffect(() => {
    const savedState = localStorage.getItem('simple-demo-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const loadedState: SimpleState = {
          group: parsed.group ? new Group(parsed.group.members.map(BigInt)) : null,
          identity: parsed.identity ? new Identity(parsed.identity) : null,
          isMember: parsed.isMember || false,
          proof: parsed.proof || null
        };
        
        // Verificar y sincronizar la membresía después de cargar
        if (loadedState.group && loadedState.identity && loadedState.isMember) {
          const identityInGroup = loadedState.group.members.some(
            member => member.toString() === loadedState.identity!.commitment.toString()
          );
          
          if (!identityInGroup) {
            // Si dice que es miembro pero no está en el grupo, agregarlo
            loadedState.group.addMember(loadedState.identity.commitment);
          }
        }
        
        setState(loadedState);
      } catch (error) {
        console.error('Error loading simple demo state:', error);
      }
    }
  }, []);

  // Guardar estado en localStorage
  const saveState = (newState: SimpleState) => {
    setState(newState);
    const stateToSave = {
      group: newState.group ? {
        members: newState.group.members.map(member => member.toString())
      } : null,
      identity: newState.identity ? newState.identity.toString() : null,
      isMember: newState.isMember,
      proof: newState.proof
    };
    localStorage.setItem('simple-demo-state', JSON.stringify(stateToSave));
  };

  // Crear grupo
  const createGroup = () => {
    const newGroup = new Group();
    const newState = { ...state, group: newGroup, isMember: false, proof: null };
    saveState(newState);
    setErrorMessage(''); // Limpiar errores
  };

  // Crear identidad
  const createIdentity = () => {
    const newIdentity = new Identity();
    const newState = { ...state, identity: newIdentity, isMember: false, proof: null };
    saveState(newState);
    setErrorMessage(''); // Limpiar errores
  };

  // Agregar identidad al grupo
  const addToGroup = () => {
    if (!state.group || !state.identity) return;

    state.group.addMember(state.identity.commitment);
    const newState = { ...state, isMember: true, proof: null };
    saveState(newState);
    setErrorMessage(''); // Limpiar errores
  };

  // Helper para obtener el secreto de la identidad
  const getIdentitySecret = (identity: Identity): string => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const identityAny = identity as any;
      return identityAny._secretScalar?.toString() || identityAny.secretScalar?.toString() || 'ERROR_SECRET';
    } catch {
      return 'ERROR_SECRET';
    }
  };

  // Generar prueba
  const generateZKProof = async () => {
    if (!state.group || !state.identity || !state.isMember) return;

    setIsGeneratingProof(true);
    setErrorMessage(''); // Limpiar errores previos
    
    try {
      // Verificar que la identidad esté en el grupo
      const identityIndex = state.group.members.findIndex(
        member => member.toString() === state.identity!.commitment.toString()
      );
      
      if (identityIndex === -1) {
        throw new Error('La identidad no está en el grupo. Esto puede suceder si se recargó la página o hubo un error de sincronización.');
      }
      // Log para debug
      console.log('Generando prueba ZK con parámetros:');
      console.log('- Identity secret:', getIdentitySecret(state.identity));
      console.log('- Group members:', state.group.members.length);
      console.log('- Signal:', signal);
      console.log('- External nullifier:', externalNullifier);

      // Intentar con el orden de parámetros de la documentación oficial
      // generateProof(identity, group, message, scope, merkleTreeDepth?)
      const proof = await generateProof(
        state.identity,
        state.group,
        signal,
        externalNullifier
      );
      
      console.log('✅ Prueba ZK generada exitosamente:', proof);
      const newState = { ...state, proof: 'Prueba ZK generada exitosamente' };
      saveState(newState);
    } catch (error) {
      console.error('Error generating proof:', error);
      // Capturar el error completo para mostrar al usuario
      const errorDetails = error instanceof Error ? error.message : String(error);
      const fullError = `Error generando la prueba ZK:

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
3. Error en la librería @semaphore-noir/proof
4. Problema con el árbol de Merkle del grupo`;
      
      setErrorMessage(fullError);
    } finally {
      setIsGeneratingProof(false);
    }
  };

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
    saveState(newState);
    setErrorMessage(''); // Limpiar errores
  };

  // Limpiar todo
  const clearAll = () => {
    const emptyState: SimpleState = {
      group: null,
      identity: null,
      isMember: false,
      proof: null
    };
    saveState(emptyState);
    localStorage.removeItem('simple-demo-state');
    setErrorMessage(''); // Limpiar errores
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Demo Simple ZK</h1>
        <p className="text-gray-600 mt-2">Flujo completo de Semaphore en una sola página</p>
      </div>

      {/* Explicación del Signal y Nullifier */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">📡 ¿Qué son Signal y Nullifier?</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Signal:</strong> El mensaje/dato que quieres probar anónimamente (ej: tu voto, respuesta, opinión)</p>
          <p><strong>Nullifier:</strong> Identificador único que previene el doble uso (ej: votar dos veces en la misma elección)</p>
        </div>
      </div>

      {/* Estado actual */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Estado Actual:</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Grupo:</span>
            <span className={state.group ? 'text-green-600' : 'text-red-600'}>
              {state.group ? `✓ Creado (${state.group.members.length} miembros)` : '✗ No creado'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Identidad:</span>
            <span className={state.identity ? 'text-green-600' : 'text-red-600'}>
              {state.identity ? '✓ Creada' : '✗ No creada'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Membresía:</span>
            <span className={state.isMember ? 'text-green-600' : 'text-red-600'}>
              {state.isMember ? '✓ Agregada al grupo' : '✗ No agregada'}
            </span>
          </div>
          {state.group && state.identity && (
            <div className="flex justify-between text-xs text-gray-600">
              <span>Verificación:</span>
              <span className={
                state.group.members.some(m => m.toString() === state.identity!.commitment.toString()) 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }>
                {state.group.members.some(m => m.toString() === state.identity!.commitment.toString()) 
                  ? '✓ Identidad en grupo' 
                  : '✗ Identidad NO en grupo'
                }
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Prueba ZK:</span>
            <span className={state.proof ? 'text-green-600' : 'text-red-600'}>
              {state.proof ? '✓ Generada' : '✗ No generada'}
            </span>
          </div>
        </div>
      </div>

      {/* Paso 1: Crear Grupo */}
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

      {/* Paso 2: Crear Identidad */}
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
                 <strong>Serializada:</strong> 
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

      {/* Paso 3: Agregar al Grupo */}
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
      </div>

      {/* Paso 4: Generar Prueba */}
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
          <button
            onClick={generateZKProof}
            disabled={!state.isMember || isGeneratingProof}
            className={`w-full py-2 px-4 rounded ${
              !state.isMember
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isGeneratingProof
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : state.proof
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {!state.isMember
              ? 'Agrega identidad al grupo primero'
              : isGeneratingProof
              ? 'Generando Prueba...'
              : state.proof
              ? 'Regenerar Prueba ZK'
              : 'Generar Prueba ZK'
            }
          </button>
        </div>
      </div>

      {/* Campo de Error */}
      {errorMessage && (
        <div className="border rounded-lg p-4 bg-red-50 border-red-200">
          <h3 className="font-semibold mb-3 text-red-800">❌ Error en la Generación de Prueba</h3>
          <textarea
            value={errorMessage}
            readOnly
                         className="w-full h-40 p-3 text-xs font-mono bg-gray-800 text-white rounded resize-none"
            placeholder="Los detalles del error aparecerán aquí..."
          />
          <button
            onClick={() => setErrorMessage('')}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Limpiar Error
          </button>
        </div>
      )}

      {/* Resultado de la Prueba */}
      {state.proof && (
        <div className="border rounded-lg p-4 bg-green-50">
          <h3 className="font-semibold mb-3 text-green-800">Prueba ZK Generada ✓</h3>
          <div className="text-sm space-y-2">
            <div><strong>Signal:</strong> {signal}</div>
            <div><strong>Nullifier:</strong> {externalNullifier}</div>
            <div className="text-xs text-gray-600">
              La prueba demuestra que tu identidad pertenece al grupo sin revelar cuál es.
            </div>
          </div>
        </div>
      )}

      {/* Botones de Control */}
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
    </div>
  );
};

export default SimpleDemo; 