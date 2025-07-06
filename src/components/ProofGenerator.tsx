import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Identity } from "@semaphore-protocol/identity";
import { useGroups } from '../hooks/useGroups';

interface ProofData {
  proof: unknown;
  publicSignals: unknown;
  externalNullifier: string;
  signal: string;
  groupId: string;
  groupName: string;
}

export function ProofGenerator() {
  const { groups, identities } = useGroups();
  // Identidad temporal para generar pruebas (en producción necesitarías la clave privada real)
  const [, setIdentity] = useState<Identity | null>(null);
  // ID de la identidad seleccionada del storage
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [signal, setSignal] = useState("Hello ZK World!");
  const [externalNullifier, setExternalNullifier] = useState("voting-round-1");
  const [isGenerating, ] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [proofData, ] = useState<ProofData | null>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const selectIdentity = (identityId: string) => {
    if (identityId) {
      // Usar la identidad seleccionada del storage
      const selectedIdentity = identities[identityId];
      if (selectedIdentity) {
        // Recrear la identidad desde el commitment almacenado
        // Nota: En una implementación real, necesitarías almacenar la clave privada de forma segura
        // Por ahora, creamos una identidad temporal para la demo
          // const tempIdentity = new Identity();
          // setIdentity(tempIdentity);
        const stored = localStorage.getItem(`identity-${identityId}`);
      if (stored) {
        const restored = new Identity(stored);
        setIdentity(restored);
      }
        setSelectedIdentityId(identityId);
      }
    } else {
      setIdentity(null);
      setSelectedIdentityId("");
    }
  };

  // const generateZKProof = async () => {
  //   if (!selectedIdentityId || !groupId) return;

  //   setIsGenerating(true);
  //   setVerificationResult(null);

  //   try {
  //     const selectedIdentity = identities[selectedIdentityId];
  //     const group = groups[groupId];
      
  //     if (!selectedIdentity || !group) {
  //       alert("⚠️ Identidad o grupo no encontrado.");
  //       setIsGenerating(false);
  //       return;
  //     }

  //     // Verificar que la identidad esté en el grupo usando el commitment almacenado
  //     if (!group.members.includes(selectedIdentity.commitment)) {
  //       alert("⚠️ Tu identidad no pertenece al grupo seleccionado. Únete al grupo primero.");
  //       setIsGenerating(false);
  //       return;
  //     }

  //     // Recrear el grupo con los miembros actuales
  //     const semaphoreGroup = new Group(group.members.map(BigInt));
      
  //     // Para la demo, usamos la identidad temporal creada
  //     // En producción, necesitarías recuperar la clave privada de forma segura
  //     if (!identity) {
  //       alert("⚠️ Error: Identidad no inicializada.");
  //       setIsGenerating(false);
  //       return;
  //     }
      
  //     // Generar la prueba usando @semaphore-noir/proof
  //     const fullProof = await generateProof(
  //       identity,
  //       semaphoreGroup,
  //       externalNullifier,
  //       signal
  //     );

  //     const proofResult: ProofData = {
  //       proof: fullProof.proof,
  //       publicSignals: fullProof.publicSignals,
  //       externalNullifier,
  //       signal,
  //       groupId,
  //       groupName: group.name
  //     };

  //     setProofData(proofResult);
  //     alert("🎉 ¡Prueba zero-knowledge generada exitosamente!");

  //   } catch (error) {
  //     console.error("Error generating proof:", error);
  //     alert("❌ Error al generar la prueba. Verifica que tu identidad esté en el grupo.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const verifyZKProof = async () => {
    if (!proofData) return;

    setIsVerifying(true);

    try {
      // const group = groups[proofData.groupId];
      // // const treeDepth = group.depth;
      
      // // const isValid = await verifyProof(proofData, treeDepth);
      // // setVerificationResult(isValid);

      // if (isValid) {
      //   alert("✅ ¡Prueba verificada exitosamente! La prueba es válida.");
      // } else {
      //   alert("❌ La prueba no es válida.");
      // }

    } catch (error) {
      console.error("Error verifying proof:", error);
      alert("❌ Error al verificar la prueba.");
      setVerificationResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyProofToClipboard = () => {
    if (proofData) {
      navigator.clipboard.writeText(JSON.stringify(proofData, null, 2));
      alert("📋 Prueba copiada al portapapeles");
    }
  };

  return (
    <motion.div 
      layout 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-fit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Generador de Pruebas ZK</h2>
            <p className="text-orange-100 text-sm">Crea pruebas zero-knowledge anónimas</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Educational Info */}
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">🔐 ¿Qué es una Prueba Zero-Knowledge?</h4>
          <p className="text-sm text-orange-700 leading-relaxed">
            Una prueba ZK te permite demostrar que conoces un secreto (perteneces a un grupo) 
            sin revelar cuál es ese secreto (tu identidad específica). Incluye un <strong>nullifier</strong> 
            único para prevenir doble-gasto o doble-voto.
          </p>
        </div>

        <div className="space-y-6">
                    {/* Step 1: Identity for Proof */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Seleccionar Identidad</h3>
            
            {Object.keys(identities).length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Identidad para generar la prueba
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={selectedIdentityId}
                    onChange={(e) => selectIdentity(e.target.value)}
                  >
                    <option value="">Selecciona una identidad...</option>
                    {Object.entries(identities).map(([id, storedIdentity]) => (
                      <option key={id} value={id}>
                        {storedIdentity.name} - {storedIdentity.commitment.slice(0, 20)}...
                      </option>
                    ))}
                  </select>
                </div>
                {selectedIdentityId && identities[selectedIdentityId] && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-orange-800 text-sm">
                        Identidad "{identities[selectedIdentityId]?.name}" seleccionada
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded border font-mono text-xs break-all text-gray-700">
                      {identities[selectedIdentityId]?.commitment.slice(0, 50)}...
                    </div>
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠️ Asegúrate de que esta identidad esté en el grupo que selecciones.
                    </p>
                    {/* Mostrar en qué grupos está esta identidad */}
                    {(() => {
                      const memberGroups = Object.entries(groups).filter(([, group]) => 
                        group.members.includes(identities[selectedIdentityId]?.commitment || '')
                      );
                      if (memberGroups.length > 0) {
                        return (
                          <div className="mt-2 text-xs text-orange-700">
                            <span className="font-medium">Miembro de:</span> {memberGroups.map(([, g]) => g.name).join(', ')}
                          </div>
                        );
                      }
                      return (
                        <div className="mt-2 text-xs text-red-600">
                          ⚠️ Esta identidad no pertenece a ningún grupo. Agrégala a un grupo primero.
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No hay identidades disponibles</h4>
                <p className="text-gray-500">Crea identidades en el "Creador de Identidades" primero</p>
              </div>
            )}
          </div>

          {/* Step 2: Proof Parameters */}
          {selectedIdentityId && identities[selectedIdentityId] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">2. Parámetros de la Prueba</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grupo
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecciona un grupo...
                    </option>
                    {Object.entries(groups).map(([id, g]) => (
                      <option key={id} value={id}>
                        {g.name} ({g.members.length} miembros)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensaje/Señal
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Mensaje anónimo a enviar..."
                    value={signal}
                    onChange={(e) => setSignal(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nullifier Externo (Scope)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="ej: voting-round-1, poll-123..."
                    value={externalNullifier}
                    onChange={(e) => setExternalNullifier(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El scope previene doble-signaling. Usa el mismo valor para el mismo contexto.
                  </p>
                </div>
              </div>

              <button
                className="w-full px-6 py-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
                disabled={!selectedIdentityId || !groupId || !signal.trim() || !externalNullifier.trim() || isGenerating}
                onClick={() => {}}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generando prueba ZK...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Generar Prueba Zero-Knowledge</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 3: Proof Display */}
          <AnimatePresence>
            {proofData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-green-800">Prueba ZK Generada</h4>
                      <p className="text-sm text-green-600">Tu prueba anónima está lista</p>
                    </div>
                  </div>
                  <button
                    onClick={copyProofToClipboard}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-200"
                  >
                    Copiar
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-1">Grupo:</p>
                      <p className="text-sm text-green-800">{proofData.groupName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-1">Mensaje:</p>
                      <p className="text-sm text-green-800">"{proofData.signal}"</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">Nullifier Hash:</p>
                    <div className="bg-white p-2 rounded border font-mono text-xs break-all text-gray-700">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(proofData.publicSignals as any)?.nullifierHash || 'N/A'}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                      disabled={isVerifying}
                      onClick={verifyZKProof}
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Verificando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Verificar Prueba</span>
                        </>
                      )}
                    </button>

                    {verificationResult !== null && (
                      <div className={`flex items-center px-4 py-3 rounded-lg ${
                        verificationResult 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {verificationResult ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Válida
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Inválida
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info when no groups */}
          {Object.keys(groups).length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No hay grupos disponibles</h4>
              <p className="text-gray-500">Crea grupos e identidades primero para generar pruebas</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 