import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, Bot, ChevronDown, ChevronUp, FileText, Eye } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface EnhancedCitation {
  display: string;
  reference: string;
  fullText: string;
  documentId: string;
}

interface EnhancedChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  // Enhanced response format
  message?: string;
  keyPoints?: string[];
  citations?: EnhancedCitation[];
  confidence?: number;
  followUp?: string;
  showMoreCitations?: boolean;
}

interface EnhancedChatInterfaceProps {
  onCitationClick: (citation: any) => void;
  onSendMessage: (message: string) => Promise<void>;
  messages: EnhancedChatMessage[];
  isLoading: boolean;
  sampleQuestions: string[];
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  onCitationClick,
  onSendMessage,
  messages,
  isLoading,
  sampleQuestions
}) => {
  const [inputValue, setInputValue] = useState('');
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await onSendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSampleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  const toggleCitations = (messageId: string) => {
    const newExpanded = new Set(expandedCitations);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedCitations(newExpanded);
  };

  const renderUserMessage = (message: EnhancedChatMessage) => (
    <div className="flex justify-end">
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-blue-600 text-white p-3 rounded-lg rounded-br-none">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <div className="text-xs text-blue-200 mt-2">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIMessage = (message: EnhancedChatMessage) => {
    const isExpanded = expandedCitations.has(message.id);
    const hasEnhancedData = message.message || message.keyPoints || message.citations;

    return (
      <div className="flex justify-start">
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
            {/* Main message content */}
            <p className="text-sm whitespace-pre-wrap mb-2">
              {hasEnhancedData ? message.message : message.content}
            </p>

            {/* Key Points */}
            {message.keyPoints && message.keyPoints.length > 0 && (
              <div className="mb-3">
                <div className="space-y-1">
                  {message.keyPoints.map((point, index) => (
                    <div key={index} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-600 flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    References
                  </p>
                  {message.showMoreCitations && (
                    <button
                      onClick={() => toggleCitations(message.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 mr-1" />
                          Show more
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {message.citations.slice(0, isExpanded ? undefined : 2).map((citation, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded p-2">
                      <div className="text-xs font-medium text-gray-800 mb-1">
                        {citation.display}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {citation.reference}
                      </div>
                      <button
                        onClick={() => onCitationClick(citation)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View in document
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up question */}
            {message.followUp && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 italic">
                  💡 {message.followUp}
                </p>
              </div>
            )}

            {/* Confidence indicator */}
            {message.confidence && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Confidence</span>
                  <span>{Math.round(message.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className="bg-green-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${message.confidence * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            AI Document Assistant
          </h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Ask questions about the current document and get conversational AI answers with smart citations
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Start a conversation</p>
                <p className="text-sm">Ask questions about the document to get AI-powered answers with smart citations.</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' ? renderUserMessage(message) : renderAIMessage(message)}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">AI is analyzing the document...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Sample Questions */}
      {sampleQuestions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestionClick(question)}
                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the document..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;
