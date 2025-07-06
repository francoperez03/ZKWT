import { motion } from "framer-motion";
import { useGroups } from '../hooks/useGroups';

export function Dashboard() {
  const { groups, identities } = useGroups();
  
  const totalGroups = Object.keys(groups).length;
  const totalIdentities = Object.keys(identities).length;
  const totalMembers = Object.values(groups).reduce((sum, group) => sum + group.members.length, 0);
  
  // Calcular progreso del flujo
  const hasGroups = totalGroups > 0;
  const hasIdentities = totalIdentities > 0;
  const hasMemberships = totalMembers > 0;
  
  const steps = [
    {
      id: 1,
      title: "Crear Grupos",
      description: "Define grupos para organizar identidades",
      completed: hasGroups,
      count: totalGroups,
      icon: "👥",
      color: "green"
    },
    {
      id: 2,
      title: "Crear Identidades",
      description: "Genera identidades anónimas seguras",
      completed: hasIdentities,
      count: totalIdentities,
      icon: "🔐",
      color: "purple"
    },
    {
      id: 3,
      title: "Gestionar Membresías",
      description: "Agrega identidades a grupos específicos",
      completed: hasMemberships,
      count: totalMembers,
      icon: "🔗",
      color: "blue"
    },
    {
      id: 4,
      title: "Generar Pruebas ZK",
      description: "Crea pruebas de conocimiento cero",
      completed: false,
      count: 0,
      icon: "⚡",
      color: "orange"
    }
  ];

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Control Semaphore</h1>
            <p className="text-indigo-100">Gestiona tu ecosistema de privacidad zero-knowledge</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">{totalGroups}</p>
                <p className="text-sm text-green-600">Grupos Creados</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-800">{totalIdentities}</p>
                <p className="text-sm text-purple-600">Identidades Creadas</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">{totalMembers}</p>
                <p className="text-sm text-blue-600">Membresías Activas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">🚀 Flujo de Trabajo Semaphore</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  step.completed ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {step.completed ? '✅' : step.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-bold ${step.completed ? 'text-green-800' : 'text-gray-700'}`}>
                      {step.title}
                    </h4>
                    {step.count > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        step.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {step.count}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {step.completed ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <h4 className="font-bold text-amber-800 mb-3">💡 Próximos Pasos Recomendados</h4>
          {!hasGroups && (
            <p className="text-amber-700 mb-2">
              • <strong>Comienza creando un grupo</strong> en la pestaña "Gestor de Grupos"
            </p>
          )}
          {hasGroups && !hasIdentities && (
            <p className="text-amber-700 mb-2">
              • <strong>Crea identidades anónimas</strong> en la pestaña "Gestor de Identidades"
            </p>
          )}
          {hasGroups && hasIdentities && !hasMemberships && (
            <p className="text-amber-700 mb-2">
              • <strong>Agrega identidades a grupos</strong> en la pestaña "Gestor de Membresías"
            </p>
          )}
          {hasGroups && hasIdentities && hasMemberships && (
            <p className="text-amber-700 mb-2">
              • <strong>¡Listo para generar pruebas ZK!</strong> Ve a la pestaña "Generador de Pruebas"
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
} 