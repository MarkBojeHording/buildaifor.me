import React, { useState } from 'react';
import { Building2, MessageSquare, Upload, BarChart3, Settings } from 'lucide-react';
import { ChatInterface } from '../components/estate/ChatInterface';
import { DocumentUpload } from '../components/estate/DocumentUpload';
import { ClientDashboard } from '../components/estate/ClientDashboard';
import { EscalationModal } from '../components/estate/EscalationModal';
import { Client } from '../types/estate';
import { MOCK_MARKET_INSIGHTS, MOCK_SAVED_PROPERTIES } from '../utils/estate/constants';

type ActiveTab = 'chat' | 'upload' | 'dashboard' | 'analytics';

const EstateAssistant = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [chatId] = useState('chat-' + Date.now());

  // Mock client data
  const mockClient: Client = {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    preferences: {
      priceRange: { min: 300000, max: 600000 },
      bedrooms: 3,
      bathrooms: 2,
      propertyTypes: ['Single Family Home', 'Condominium'],
      locations: ['Downtown', 'Suburbs', 'Waterfront'],
      features: ['Parking', 'Garden', 'Modern Kitchen'],
    },
    savedProperties: ['1', '2'],
  };

  const handleEscalate = () => {
    setShowEscalationModal(true);
  };

  const TabButton: React.FC<{
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    active: boolean;
  }> = ({ id, label, icon: Icon, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Premier Realty AI</h1>
                <p className="text-sm text-gray-600">Professional Real Estate Assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>Licensed in CA, NY, TX</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-4">
            <TabButton
              id="chat"
              label="AI Assistant"
              icon={MessageSquare}
              active={activeTab === 'chat'}
            />
            <TabButton
              id="upload"
              label="Documents"
              icon={Upload}
              active={activeTab === 'upload'}
            />
            <TabButton
              id="dashboard"
              label="Dashboard"
              icon={BarChart3}
              active={activeTab === 'dashboard'}
            />
            <TabButton
              id="analytics"
              label="Analytics"
              icon={Settings}
              active={activeTab === 'analytics'}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[calc(100vh-200px)]">
          {activeTab === 'chat' && (
            <ChatInterface onEscalate={handleEscalate} />
          )}

          {activeTab === 'upload' && (
            <DocumentUpload />
          )}

          {activeTab === 'dashboard' && (
            <ClientDashboard
              client={mockClient}
              marketInsights={MOCK_MARKET_INSIGHTS}
              savedProperties={MOCK_SAVED_PROPERTIES}
              onEscalate={handleEscalate}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive analytics and reporting features coming soon.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Escalation Modal */}
      <EscalationModal
        isOpen={showEscalationModal}
        onClose={() => setShowEscalationModal(false)}
        chatId={chatId}
        context="Recent chat conversation context"
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Premier Realty AI</h3>
              <p className="text-gray-400 text-sm">
                Professional real estate assistance powered by advanced AI technology and backed by licensed professionals.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@premierealty.ai</p>
                <p>Available 24/7</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Licensed Real Estate Brokerage</p>
                <p>CA DRE #01234567</p>
                <p>Equal Housing Opportunity</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Premier Realty AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EstateAssistant;
