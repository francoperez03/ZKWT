import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dashboard, 
  GroupManager, 
  IdentityManager, 
  MembershipManager, 
  SimpleDemoRefactored
} from './components';
import { GroupProvider } from './components/GroupProvider';

type TabType = 'dashboard' | 'groups' | 'identities' | 'memberships' | 'proofs' | 'simple';

interface Tab {
  id: TabType;
  name: string;
  icon: string;
  color: string;
  description: string;
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('simple');

  const tabs: Tab[] = [
    {
      id: 'simple',
      name: 'Demo Simple',
      icon: '🎯',
      color: 'red',
      description: 'Flujo completo simplificado'
    },
    {
      id: 'dashboard',
      name: 'Panel de Control',
      icon: '📊',
      color: 'indigo',
      description: 'Vista general del sistema'
    },
    {
      id: 'groups',
      name: 'Gestor de Grupos',
      icon: '👥',
      color: 'green',
      description: 'Crear y administrar grupos'
    },
    {
      id: 'identities',
      name: 'Gestor de Identidades',
      icon: '🔐',
      color: 'purple',
      description: 'Crear identidades anónimas'
    },
    {
      id: 'memberships',
      name: 'Gestor de Membresías',
      icon: '🔗',
      color: 'blue',
      description: 'Conectar identidades con grupos'
    },
    {
      id: 'proofs',
      name: 'Generador de Pruebas',
      icon: '⚡',
      color: 'orange',
      description: 'Crear pruebas zero-knowledge'
    },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'groups':
        return <GroupManager />;
      case 'identities':
        return <IdentityManager />;
      case 'memberships':
        return <MembershipManager />;
      case 'simple':
        return <SimpleDemoRefactored />;
      default:
        return <SimpleDemoRefactored />;
    }
  };

  const getTabColorClasses = (tab: Tab, isActive: boolean) => {
    const colorMap = {
      indigo: isActive 
        ? 'bg-indigo-100 text-indigo-800 border-indigo-300' 
        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50',
      green: isActive 
        ? 'bg-green-100 text-green-800 border-green-300' 
        : 'text-gray-600 hover:text-green-600 hover:bg-green-50',
      purple: isActive 
        ? 'bg-purple-100 text-purple-800 border-purple-300' 
        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50',
      blue: isActive 
        ? 'bg-blue-100 text-blue-800 border-blue-300' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
      orange: isActive 
        ? 'bg-orange-100 text-orange-800 border-orange-300' 
        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
      red: isActive 
        ? 'bg-red-100 text-red-800 border-red-300' 
        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
    };
    return colorMap[tab.color as keyof typeof colorMap];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Semaphore ZK Workshop
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Plataforma educativa de Zero-Knowledge Proofs
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistema activo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  getTabColorClasses(tab, activeTab === tab.id)
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderActiveComponent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Demo educativo del protocolo Semaphore • Desarrollado para EkoParty 2024
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-400">
              <span>🔐 Zero-Knowledge Proofs</span>
              <span>🌳 Merkle Trees</span>
              <span>🎭 Identidades Anónimas</span>
              <span>⚡ zk-SNARKs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GroupProvider>
      <AppContent />
    </GroupProvider>
  );
}
