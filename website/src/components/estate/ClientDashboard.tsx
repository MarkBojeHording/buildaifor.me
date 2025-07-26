import React, { useState } from 'react';
import { User, Home, Heart, TrendingUp, MapPin, DollarSign, Settings, Phone, Mail, Award, Star } from 'lucide-react';
import { Client, MarketInsight, PropertyReference, AgentInfo } from '../../types/index.ts';

interface ClientDashboardProps {
  client: Client;
  marketInsights: MarketInsight[];
  savedProperties: PropertyReference[];
  onEscalate: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  client,
  marketInsights,
  savedProperties,
  onEscalate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'insights' | 'preferences'>('overview');

  const mockAgent: AgentInfo = {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@premierealty.com',
    phone: '(555) 123-4567',
    license: 'RE#12345678',
    specialties: ['Luxury Homes', 'First-Time Buyers', 'Investment Properties'],
    rating: 4.9,
    reviews: 127,
  };

  const TabButton: React.FC<{ id: string; label: string; icon: React.ElementType; active: boolean }> = ({
    id,
    label,
    icon: Icon,
    active,
  }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Client Dashboard</h2>
              <p className="text-gray-600 text-sm">Welcome back, {client.name}</p>
            </div>
          </div>
          <button
            onClick={onEscalate}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">Contact Agent</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4">
          <TabButton id="overview" label="Overview" icon={Home} active={activeTab === 'overview'} />
          <TabButton id="properties" label="Saved Properties" icon={Heart} active={activeTab === 'properties'} />
          <TabButton id="insights" label="Market Insights" icon={TrendingUp} active={activeTab === 'insights'} />
          <TabButton id="preferences" label="Preferences" icon={Settings} active={activeTab === 'preferences'} />
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Agent Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Real Estate Agent</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{mockAgent.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">Licensed Real Estate Professional</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{mockAgent.rating}</span>
                      <span className="text-sm text-gray-600">({mockAgent.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{mockAgent.license}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{mockAgent.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{mockAgent.phone}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Specialties:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {mockAgent.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-900">{savedProperties.length}</p>
                    <p className="text-sm text-green-700">Saved Properties</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{marketInsights.length}</p>
                    <p className="text-sm text-blue-700">Market Insights</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{client.preferences.locations.length}</p>
                    <p className="text-sm text-purple-700">Preferred Areas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Saved Properties</h3>
              <span className="text-sm text-gray-600">{savedProperties.length} properties</span>
            </div>

            {savedProperties.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No saved properties yet</p>
                <p className="text-sm text-gray-500 mt-1">Properties you save will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedProperties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{property.address}</h4>
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {property.bedrooms} bed • {property.bathrooms} bath • {property.sqft.toLocaleString()} sqft
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-gray-900">${property.price.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        property.status === 'Active' ? 'bg-green-100 text-green-800' :
                        property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Market Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
              <span className="text-sm text-gray-600">Updated daily</span>
            </div>

            <div className="space-y-3">
              {marketInsights.map((insight) => (
                <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{insight.location}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          Updated {insight.lastUpdated.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{insight.value}</span>
                      <div className={`flex items-center space-x-1 ${
                        insight.trend === 'up' ? 'text-green-600' :
                        insight.trend === 'down' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${insight.trend === 'down' ? 'rotate-180' : ''}`} />
                        <span className="text-sm font-medium">{insight.percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Search Preferences</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    ${client.preferences.priceRange.min.toLocaleString()} - ${client.preferences.priceRange.max.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Property Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {client.preferences.bedrooms}+ bedrooms, {client.preferences.bathrooms}+ bathrooms
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Preferred Locations</h4>
                <div className="flex flex-wrap gap-2">
                  {client.preferences.locations.map((location, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {location}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Property Types</h4>
                <div className="flex flex-wrap gap-2">
                  {client.preferences.propertyTypes.map((type, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
