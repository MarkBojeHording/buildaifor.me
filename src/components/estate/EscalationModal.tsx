import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, X, CheckCircle } from 'lucide-react';
import { apiClient } from '../../api/client';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  context: string;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  chatId,
  context,
}) => {
  const [escalationData, setEscalationData] = useState<Partial<any>>({
    reason: '',
    urgency: 'medium',
    clientMessage: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'high', label: 'High Priority', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const escalationReasons = [
    'Complex property valuation needed',
    'Legal or contract questions',
    'Financing and mortgage assistance',
    'Property inspection concerns',
    'Market analysis beyond AI scope',
    'Personal consultation request',
    'Technical issue with platform',
    'Other (please specify)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const request = {
        chatId,
        reason: escalationData.reason!,
        urgency: escalationData.urgency!,
        clientMessage: escalationData.clientMessage!,
        context,
      };

      await apiClient.escalateToAgent(request);
      setSubmitted(true);
    } catch (error) {
      console.error('Escalation failed:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEscalationData({
      reason: '',
      urgency: 'medium',
      clientMessage: '',
    });
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Real Estate Agent</h2>
                <p className="text-sm text-gray-600">Connect with a licensed professional</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted Successfully</h3>
              <p className="text-gray-600 mb-4">
                A licensed real estate agent will contact you shortly to assist with your inquiry.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900">Expected Response Time</p>
                    <p className="text-sm text-blue-700">
                      {escalationData.urgency === 'high' ? '15-30 minutes' :
                       escalationData.urgency === 'medium' ? '1-2 hours' :
                       '2-4 hours'} during business hours
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Your Agent Will Contact You Via:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Phone: (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Email: agent@premierealty.com</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Contact
                </label>
                <select
                  value={escalationData.reason}
                  onChange={(e) => setEscalationData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a reason</option>
                  {escalationReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {urgencyLevels.map((level) => (
                    <label key={level.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={escalationData.urgency === level.value}
                        onChange={(e) => setEscalationData(prev => ({ ...prev, urgency: e.target.value as any }))}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-3 text-center transition-all ${
                        escalationData.urgency === level.value
                          ? `border-blue-500 ${level.bg}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center justify-center space-x-1">
                          <AlertTriangle className={`w-4 h-4 ${level.color}`} />
                          <span className={`text-sm font-medium ${level.color}`}>
                            {level.label}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Client Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={escalationData.clientMessage}
                  onChange={(e) => setEscalationData(prev => ({ ...prev, clientMessage: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide any additional details about your inquiry..."
                  required
                />
              </div>

              {/* Context Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Conversation Context</h4>
                <p className="text-sm text-gray-600">
                  The agent will receive your recent conversation history to better understand your needs.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !escalationData.reason || !escalationData.clientMessage}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>Contact Agent</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
