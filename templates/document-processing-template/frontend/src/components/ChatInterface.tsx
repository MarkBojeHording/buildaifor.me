import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, Bot } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface Citation {
  documentId: string;
  section: string;
  page: number;
  paragraph: number;
  text: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

interface ChatInterfaceProps {
  onCitationClick: (citation: Citation) => void;
  onSendMessage: (message: string) => Promise<void>;
  messages: ChatMessage[];
  isLoading: boolean;
  sampleQuestions: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onCitationClick,
  onSendMessage,
  messages,
  isLoading,
  sampleQuestions
}) => {
  const [inputValue, setInputValue] = useState('');
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

  const formatCitation = (citation: Citation) => {
    return `Section ${citation.section}, Page ${citation.page}`;
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
          Ask questions about the current document and get AI-powered answers with citations
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
                <p className="text-sm">Ask questions about the document to get AI-powered answers with precise citations.</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="flex">
                <div className={`flex-1 max-w-xs lg:max-w-md ${
                  message.type === 'user' ? 'ml-auto' : ''
                }`}>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'chat-bubble-user'
                      : 'chat-bubble-ai'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* Citations */}
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-2">Citations:</p>
                        <div className="space-y-1">
                          {message.citations.map((citation, index) => (
                            <button
                              key={index}
                              onClick={() => onCitationClick(citation)}
                              className="citation-link text-xs block text-left"
                            >
                              {formatCitation(citation)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex">
                <div className="chat-bubble-ai">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is analyzing the document...</span>
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

export default ChatInterface;
