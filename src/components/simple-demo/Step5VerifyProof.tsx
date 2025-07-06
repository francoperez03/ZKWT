import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { verifyProof as verifyProofNoir } from '@semaphore-noir/proof';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { verifyProof as verifyProofProtocol } from '@semaphore-protocol/proof';
import type { SimpleStepProps } from './types';

const Step5VerifyProof: React.FC<SimpleStepProps> = ({ state, onStateChange, onError }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [proofDetails, setProofDetails] = useState<string>('');
  const [verificationLibrary, setVerificationLibrary] = useState<string>('');

  // Función para mostrar los detalles de la prueba
  const displayProofDetails = () => {
    if (!state.proof) {
      setProofDetails('No hay prueba disponible para mostrar');
      return;
    }

    if (proofDetails) {
      setProofDetails('');
      return;
    }
    console.log(state.proof);
    const details = `DETALLES DE LA PRUEBA ZK:

1. ESTRUCTURA DE LA PRUEBA:
   - Merkle Tree Depth: ${state.proof.merkleTreeDepth}
   - Merkle Tree Root: ${state.proof.merkleTreeRoot}
   - Nullifier: ${state.proof.nullifier}
   - Message: ${state.proof.message}
   - Scope: ${state.proof.scope}

2. PUNTOS CRIPTOGRÁFICOS (zk-SNARK):
   - Punto A: [${state.proof.points[0]}, ${state.proof.points[1]}]
   - Punto B: [[${state.proof.points[2]}, ${state.proof.points[3]}], [${state.proof.points[4]}, ${state.proof.points[5]}]]
   - Punto C: [${state.proof.points[6]}, ${state.proof.points[7]}]

3. INFORMACIÓN ADICIONAL:
   - Signal usado: "${state.signal}"
   - External Nullifier: "${state.externalNullifier}"
   - Grupo Root: ${state.group?.root.toString()}
   - Miembros del grupo: ${state.group?.members.length || 0}

4. VERIFICACIÓN:
   - Estado: ${state.proofVerified === null ? 'No verificado' : state.proofVerified ? 'VÁLIDA ✓' : 'INVÁLIDA ✗'}
   - Librería usada: ${verificationLibrary || 'Ninguna'}

5. PUBLIC INPUTS EXPLICADOS:
   - Merkle Root: Identifica el grupo de manera única
   - Nullifier: Previene doble-gasto (una identidad = un voto)
   - Message: El contenido del mensaje/voto (público)
   - Scope: Contexto único de la prueba (público)

6. PRIVATE INPUTS (NO REVELADOS):
   - Identity Secret: El secreto de tu identidad (privado)
   - Merkle Path: Ruta en el árbol que prueba membresía (privado)`;

    setProofDetails(details);
  };

  const verifyZKProof = async (useProtocol: boolean = false) => {
    if (!state.proof) return;

    setIsVerifying(true);
    onError(''); // Limpiar errores previos

    const libraryName = useProtocol ? '@semaphore-protocol/proof' : '@semaphore-noir/proof';
    setVerificationLibrary(libraryName);

    try {
      console.log(`Verificando prueba ZK con ${libraryName}:`, state.proof);
      
      // Usar la función de verificación correspondiente
      const verifyProofFn = useProtocol ? verifyProofProtocol : verifyProofNoir;
      
      // Convertir la prueba al formato esperado por cada librería si es necesario
      const proofToVerify = state.proof;
      
      const isValid = await verifyProofFn(proofToVerify);
      
      console.log(`✅ Resultado de verificación con ${libraryName}:`, isValid);
      
      const newState = {
        ...state,
        proofVerified: isValid
      };
      
      onStateChange(newState);
      
      if (isValid) {
        console.log(`🎉 La prueba ZK es VÁLIDA (verificada con ${libraryName}) - La identidad pertenece al grupo sin revelar cuál es`);
      } else {
        console.log(`❌ La prueba ZK es INVÁLIDA (verificada con ${libraryName}) - Algo salió mal en la generación o verificación`);
      }
      
    } catch (error) {
      console.error(`Error verificando prueba con ${libraryName}:`, error);
      
      const errorDetails = error instanceof Error ? error.message : String(error);
      const fullError = `Error verificando la prueba ZK con ${libraryName}:

Detalles técnicos:
${errorDetails}

Stack trace:
${error instanceof Error && error.stack ? error.stack : 'No disponible'}

Prueba utilizada:
- Merkle Tree Root: ${state.proof.merkleTreeRoot}
- Nullifier: ${state.proof.nullifier}
- Message: ${state.proof.message}
- Scope: ${state.proof.scope}

Posibles causas:
1. La prueba fue generada con una librería diferente
2. Los parámetros no coinciden con los esperados
3. Error en la librería de verificación ${libraryName}
4. La prueba fue modificada o corrompida
5. Incompatibilidad entre formatos de prueba`;
      
      onError(fullError);
      
      // Marcar como inválida en caso de error
      const newState = {
        ...state,
        proofVerified: false
      };
      onStateChange(newState);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">5. Verificar Prueba ZK</h3>
      
      {!state.proof ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-gray-600">
            Primero genera una prueba ZK en el paso anterior
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Prueba ZK Disponible</h4>
            <div className="text-sm text-blue-700">
              <div><strong>Signal:</strong> {state.signal}</div>
              <div><strong>Nullifier:</strong> {state.externalNullifier}</div>
              <div><strong>Root del grupo:</strong> {state.group?.root.toString().slice(0, 20)}...</div>
            </div>
          </div>

          {/* Botón para mostrar detalles de la prueba */}
          <button
            onClick={displayProofDetails}
            className="w-full py-3 px-4 rounded-lg font-medium transition-colors mb-3 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
          >
            {proofDetails ? 'Ocultar Detalles de la Prueba' : 'Mostrar Detalles de la Prueba'}
          </button>

          {/* Campo de texto para mostrar detalles de la prueba */}
          {proofDetails && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Detalles de la Prueba:
              </label>
              <textarea
                value={proofDetails}
                readOnly
                className="w-full p-3 border rounded bg-white font-mono text-sm text-gray-800 resize-y border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={30}
                style={{ minHeight: '500px' }}
              />
            </div>
          )}

          {/* Botones para verificar con cada librería */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => verifyZKProof(false)}
              disabled={isVerifying}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                isVerifying
                  ? 'bg-yellow-500 text-white cursor-not-allowed'
                  : state.proofVerified === null || verificationLibrary !== '@semaphore-noir/proof'
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                  : state.proofVerified
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  : 'bg-red-800 text-white hover:bg-red-900 shadow-md hover:shadow-lg'
              }`}
            >
              {isVerifying
                ? 'Verificando...'
                : state.proofVerified !== null && verificationLibrary === '@semaphore-noir/proof'
                ? state.proofVerified
                  ? 'VÁLIDA ✓ - Verificar de nuevo (noir)'
                  : 'INVÁLIDA ✗ - Verificar de nuevo (noir)'
                : 'Verificar con @semaphore-noir/proof'
              }
            </button>

            <button
              onClick={() => verifyZKProof(true)}
              disabled={isVerifying}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                isVerifying
                  ? 'bg-yellow-500 text-white cursor-not-allowed'
                  : state.proofVerified === null || verificationLibrary !== '@semaphore-protocol/proof'
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  : state.proofVerified
                  ? 'bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg'
                  : 'bg-green-800 text-white hover:bg-green-900 shadow-md hover:shadow-lg'
              }`}
            >
              {isVerifying
                ? 'Verificando...'
                : state.proofVerified !== null && verificationLibrary === '@semaphore-protocol/proof'
                ? state.proofVerified
                  ? 'VÁLIDA ✓ - Verificar de nuevo (protocol)'
                  : 'INVÁLIDA ✗ - Verificar de nuevo (protocol)'
                : 'Verificar con @semaphore-protocol/proof'
              }
            </button>
          </div>

          {/* Resultado de la verificación */}
          {state.proofVerified !== null && (
            <div className={`mt-3 p-3 rounded ${
              state.proofVerified 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                state.proofVerified ? 'text-green-800' : 'text-red-800'
              }`}>
                {state.proofVerified ? 'Verificación Exitosa ✓' : 'Verificación Fallida ✗'}
              </h4>
              <div className={`text-sm space-y-2 ${
                state.proofVerified ? 'text-green-800' : 'text-red-800'
              }`}>
                <div><strong>Librería:</strong> {verificationLibrary}</div>
                {state.proofVerified ? (
                  <>
                    <div><strong>Resultado:</strong> La prueba ZK es VÁLIDA</div>
                    <div><strong>Significado:</strong> La identidad pertenece al grupo sin revelar cuál es</div>
                    <div><strong>Garantías:</strong> Anonimato preservado y membresía demostrada</div>
                  </>
                ) : (
                  <>
                    <div><strong>Resultado:</strong> La prueba ZK es INVÁLIDA</div>
                    <div><strong>Significado:</strong> La prueba no pudo ser verificada correctamente</div>
                    <div><strong>Recomendación:</strong> Revisar la generación de la prueba o probar con la otra librería</div>
                  </>
                )}
                <div className="text-xs text-gray-600 mt-2">
                  {state.proofVerified 
                    ? 'Esta verificación confirma matemáticamente que la prueba es correcta sin revelar información privada.'
                    : 'Una prueba inválida puede indicar errores en la generación, incompatibilidad de librerías o parámetros incorrectos.'
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step5VerifyProof; 