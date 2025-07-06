import { useState } from "react";
import { motion } from "framer-motion";
import { useGroups } from '../hooks/useGroups';

export function MembershipManager() {
  const { addMember, groups, identities } = useGroups();
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isJoining, setIsJoining] = useState(false);

  const handleAddMembership = async () => {
    if (!selectedIdentityId || !selectedGroupId) return;
    
    setIsJoining(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const selectedIdentity = identities[selectedIdentityId];
    addMember(selectedGroupId, selectedIdentity.commitment);
    setIsJoining(false);
    
    const groupName = groups[selectedGroupId]?.name || 'el grupo';
    alert(`🎉 ¡Identidad "${selectedIdentity.name}" agregada exitosamente a "${groupName}"!`);
    
    // Limpiar selecciones
    setSelectedIdentityId("");
    setSelectedGroupId("");
  };

  const hasRequiredData = Object.keys(groups).length > 0 && Object.keys(identities).length > 0;

  // Verificar si una identidad ya está en un grupo
  const isIdentityInGroup = (identityId: string, groupId: string) => {
    const identity = identities[identityId];
    const group = groups[groupId];
    return group?.members.includes(identity.commitment) || false;
  };

  // Obtener membresías existentes
  const getMemberships = () => {
    const memberships: Array<{
      identityId: string;
      identityName: string;
      groupId: string;
      groupName: string;
      commitment: string;
    }> = [];

    Object.entries(groups).forEach(([groupId, group]) => {
      group.members.forEach(commitment => {
        const identityEntry = Object.entries(identities).find(
          ([, identity]) => identity.commitment === commitment
        );
        if (identityEntry) {
          memberships.push({
            identityId: identityEntry[0],
            identityName: identityEntry[1].name,
            groupId,
            groupName: group.name,
            commitment
          });
        }
      });
    });

    return memberships;
  };

  const memberships = getMemberships();

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-fit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gestor de Membresías</h2>
            <p className="text-blue-100 text-sm">Conecta identidades con grupos específicos</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Educational Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🔗 ¿Qué es una Membresía?</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Una membresía conecta una identidad específica con un grupo. Una vez agregada, 
            la identidad puede generar <strong>pruebas de pertenencia</strong> al grupo sin 
            revelar cuál identidad específica es. Una identidad puede pertenecer a múltiples grupos.
          </p>
        </div>

        {hasRequiredData ? (
          <div className="space-y-6">
            {/* Add Membership Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">➕ Agregar Nueva Membresía</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seleccionar Identidad
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={selectedIdentityId}
                    onChange={(e) => setSelectedIdentityId(e.target.value)}
                    disabled={isJoining}
                  >
                    <option value="" disabled>
                      Elige una identidad...
                    </option>
                    {Object.entries(identities).map(([id, identity]) => (
                      <option key={id} value={id}>
                        {identity.name} - {identity.commitment.slice(0, 20)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seleccionar Grupo
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    disabled={isJoining}
                  >
                    <option value="" disabled>
                      Elige un grupo...
                    </option>
                    {Object.entries(groups).map(([id, group]) => (
                      <option key={id} value={id}>
                        {group.name} ({group.members.length} miembros) - ID: {id.slice(0, 8)}...
                      </option>
                    ))}
                  </select>
                </div>

                {/* Validation Warning */}
                {selectedIdentityId && selectedGroupId && isIdentityInGroup(selectedIdentityId, selectedGroupId) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-sm font-medium text-yellow-800">
                        ⚠️ Esta identidad ya pertenece a este grupo
                      </span>
                    </div>
                  </div>
                )}

                {/* Operation Summary */}
                {selectedIdentityId && selectedGroupId && !isIdentityInGroup(selectedIdentityId, selectedGroupId) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 text-sm mb-2">✅ Resumen de la operación:</h4>
                    <p className="text-sm text-green-700">
                      Se agregará la identidad <strong>"{identities[selectedIdentityId]?.name}"</strong> 
                      {' '}al grupo <strong>"{groups[selectedGroupId]?.name}"</strong>
                    </p>
                  </div>
                )}

                <button
                  className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
                  disabled={!selectedGroupId || !selectedIdentityId || isJoining || isIdentityInGroup(selectedIdentityId, selectedGroupId)}
                  onClick={handleAddMembership}
                >
                  {isJoining ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creando membresía...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Crear Membresía</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Existing Memberships */}
            {memberships.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📋 Membresías Existentes ({memberships.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {memberships.map((membership, index) => (
                    <motion.div
                      key={`${membership.identityId}-${membership.groupId}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-blue-800">{membership.identityName}</span>
                            <span className="text-blue-600">→</span>
                            <span className="font-semibold text-blue-800">{membership.groupName}</span>
                          </div>
                          <div className="text-xs text-blue-600 font-mono">
                            {membership.commitment.slice(0, 40)}...
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Requisitos no cumplidos</h3>
            <div className="text-gray-500 space-y-1">
              {Object.keys(groups).length === 0 && (
                <p>• Necesitas crear al menos un grupo</p>
              )}
              {Object.keys(identities).length === 0 && (
                <p>• Necesitas crear al menos una identidad</p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 