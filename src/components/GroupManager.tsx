import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGroups } from '../hooks/useGroups';

export function GroupManager() {
  const { groups, addGroup } = useGroups();
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!name.trim()) return;
    
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addGroup(name.trim());
    setName("");
    setIsCreating(false);
  };

  return (
    <motion.div 
      layout 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-fit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gestor de Grupos</h2>
            <p className="text-green-100 text-sm">Crea y administra grupos Semaphore</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Educational Info */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">💡 ¿Qué es un Grupo Semaphore?</h4>
          <p className="text-sm text-green-700 leading-relaxed">
            Un grupo es una colección de identidades organizadas en un <strong>Merkle Tree</strong>. 
            Cada grupo tiene un <strong>root hash</strong> único que representa todas las identidades 
            sin revelar información individual. Los miembros pueden probar su pertenencia sin exponer su identidad.
          </p>
        </div>

        {/* Create Group Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del Grupo
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="ej: Desarrolladores, Votantes, DAO Members..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
                disabled={isCreating}
              />
              <button
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={handleCreateGroup}
                disabled={!name.trim() || isCreating}
              >
                {isCreating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creando...</span>
                  </div>
                ) : (
                  'Crear Grupo'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick ID Reference */}
        {Object.keys(groups).length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">📋 IDs de Grupos (Referencia Rápida)</h4>
            <div className="space-y-2">
              {Object.entries(groups).map(([id, g]) => (
                <div key={id} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="font-medium text-gray-800">{g.name}</span>
                  <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                    {id}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Grupos Existentes ({Object.keys(groups).length})
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {Object.entries(groups).map(([id, g]) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{g.name}</h4>
                      <p className="text-sm text-gray-500">
                        Creado el {new Date(g.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {g.members.length} miembros
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Merkle Root:</p>
                      <div className="bg-white p-2 rounded border font-mono text-xs break-all text-gray-700">
                        {g.root}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">ID del Grupo:</p>
                      <div className="bg-white p-2 rounded border font-mono text-xs break-all text-gray-700">
                        {id}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Profundidad del árbol: {g.depth} niveles</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {Object.keys(groups).length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay grupos creados</h3>
                <p className="text-gray-500">Crea tu primer grupo para comenzar a explorar Semaphore</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 