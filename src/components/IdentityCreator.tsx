import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Identity } from "@semaphore-protocol/identity";
import { useGroups } from '../hooks/useGroups';

export function IdentityCreator() {
  const { addMember, groups, identities, addIdentity } = useGroups();
  const [identityName, setIdentityName] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [lastGeneratedIdentity, setLastGeneratedIdentity] = useState<Identity | null>(null);

  const generateIdentity = async () => {
    if (!identityName.trim()) {
      alert("⚠️ Por favor ingresa un nombre para la identidad");
      return;
    }
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const iden = new Identity();
    setLastGeneratedIdentity(iden);
    
    // Guardar la identidad en el contexto compartido
    addIdentity(identityName.trim(), iden.commitment.toString());
    
    setIsGenerating(false);
    setIdentityName(""); // Limpiar el campo de nombre
    alert(`🎉 ¡Identidad "${identityName}" creada y guardada exitosamente!`);
  };

  const joinGroup = async () => {
    if (!selectedIdentityId || !groupId) return;
    
    setIsJoining(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const selectedIdentity = identities[selectedIdentityId];
    addMember(groupId, selectedIdentity.commitment);
    setIsJoining(false);
    
    const groupName = groups[groupId]?.name || 'el grupo';
    alert(`🎉 ¡Identidad "${selectedIdentity.name}" agregada exitosamente a "${groupName}"!\n\nAhora puedes generar pruebas zero-knowledge sin revelar tu identidad.`);
    setGroupId("");
    setSelectedIdentityId("");
  };

  return (
    <motion.div 
      layout 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-fit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Creador de Identidades</h2>
            <p className="text-purple-100 text-sm">Genera identidades anónimas y únete a grupos</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Educational Info */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">🔐 ¿Qué es una Identidad Semaphore?</h4>
          <p className="text-sm text-purple-700 leading-relaxed">
            Una identidad Semaphore es un par de claves criptográficas que te permite participar 
            de forma anónima. El <strong>commitment</strong> es tu identificador público (como una 
            huella digital única) que se agrega al grupo, mientras que tu clave privada permanece secreta.
          </p>
        </div>

        <div className="space-y-6">
          {/* Generate Identity Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Generar Nueva Identidad</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Identidad
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="ej: Mi Identidad Principal, Votante DAO..."
                  value={identityName}
                  onChange={(e) => setIdentityName(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              <button
                className="w-full px-6 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
                onClick={generateIdentity}
                disabled={isGenerating || !identityName.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generando identidad segura...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Generar Nueva Identidad</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Identity Display */}
          <AnimatePresence>
            {lastGeneratedIdentity && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-800">Identidad Generada Exitosamente</h4>
                    <p className="text-sm text-purple-600">Tu identidad anónima está lista para usar</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <span className="font-semibold text-purple-800 text-sm">Commitment (Identificador Público)</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border font-mono text-xs break-all text-gray-700 leading-relaxed">
                      {lastGeneratedIdentity.commitment.toString()}
                    </div>
                    <p className="text-xs text-purple-600 mt-1">
                      Este es tu identificador único que se agregará al grupo. Es seguro compartirlo.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Existing Identities Section */}
          {Object.keys(identities).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Identidades Guardadas ({Object.keys(identities).length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(identities).map(([id, storedIdentity]) => (
                  <div key={id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{storedIdentity.name}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(storedIdentity.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded border font-mono text-xs break-all text-gray-600">
                      {storedIdentity.commitment.slice(0, 40)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Join Group Section */}
          {Object.keys(identities).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">2. Agregar Identidad a un Grupo</h3>
              
              {Object.keys(groups).length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Seleccionar Identidad
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      value={selectedIdentityId}
                      onChange={(e) => setSelectedIdentityId(e.target.value)}
                      disabled={isJoining}
                    >
                      <option value="" disabled>
                        Elige una identidad...
                      </option>
                      {Object.entries(identities).map(([id, storedIdentity]) => (
                        <option key={id} value={id}>
                          {storedIdentity.name} - {storedIdentity.commitment.slice(0, 20)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Seleccionar Grupo
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                      disabled={isJoining}
                    >
                      <option value="" disabled>
                        Elige un grupo para unirte...
                      </option>
                      {Object.entries(groups).map(([id, g]) => (
                        <option key={id} value={id}>
                          {g.name} ({g.members.length} miembros) - ID: {id.slice(0, 8)}...
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
                    disabled={!groupId || !selectedIdentityId || isJoining}
                    onClick={joinGroup}
                  >
                    {isJoining ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Agregando identidad al grupo...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Agregar al Grupo Seleccionado</span>
                      </>
                    )}
                  </button>

                  {selectedIdentityId && groupId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 text-sm mb-2">Resumen de la operación:</h4>
                      <p className="text-sm text-blue-700">
                        Se agregará la identidad <strong>"{identities[selectedIdentityId]?.name}"</strong> 
                        {' '}al grupo <strong>"{groups[groupId]?.name}"</strong>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No hay grupos disponibles</h4>
                  <p className="text-gray-500">Crea un grupo primero para poder unir tu identidad</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 