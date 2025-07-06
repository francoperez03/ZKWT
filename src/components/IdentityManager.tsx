import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Identity } from "@semaphore-protocol/identity";
import { useGroups } from '../hooks/useGroups';

export function IdentityManager() {
  const { identities, addIdentity } = useGroups();
  const [identityName, setIdentityName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
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
            <h2 className="text-xl font-bold text-white">Gestor de Identidades</h2>
            <p className="text-purple-100 text-sm">Crea y administra identidades anónimas</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">➕ Crear Nueva Identidad</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Identidad
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="ej: Mi Identidad Principal, Votante DAO, Desarrollador..."
                  value={identityName}
                  onChange={(e) => setIdentityName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateIdentity()}
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
                    <h4 className="font-bold text-purple-800">¡Identidad Generada Exitosamente!</h4>
                    <p className="text-sm text-purple-600">Tu identidad anónima ha sido creada y guardada</p>
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
                      Este es tu identificador único que se puede agregar a grupos. Es seguro compartirlo.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Existing Identities Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📋 Identidades Guardadas ({Object.keys(identities).length})
            </h3>
            
            {Object.keys(identities).length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(identities).map(([id, storedIdentity], index) => (
                  <motion.div 
                    key={id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{storedIdentity.name}</h4>
                          <span className="text-xs text-gray-500">
                            Creada el {new Date(storedIdentity.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Activa
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Commitment:</p>
                      <div className="bg-white p-2 rounded border font-mono text-xs break-all text-gray-600">
                        {storedIdentity.commitment}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay identidades creadas</h3>
                <p className="text-gray-500">Crea tu primera identidad para comenzar a participar en grupos Semaphore</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 