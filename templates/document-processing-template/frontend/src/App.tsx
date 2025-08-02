import React, { useState, useCallback } from 'react';
import DocumentTabs from './components/DocumentTabs';
import DocumentViewer from './components/DocumentViewer';
import EnhancedChatInterface from './components/EnhancedChatInterface';
import { sampleDocuments, sampleQuestions } from './data/sampleDocuments';
import { aiChatService, type ChatRequest, type Citation } from './services/aiChatService';
import type { DocumentSection } from './data/sampleDocuments';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  // Enhanced response format
  message?: string;
  keyPoints?: string[];
  confidence?: number;
  followUp?: string;
  showMoreCitations?: boolean;
}

const App: React.FC = () => {
  const [currentDocument, setCurrentDocument] = useState('lease-agreement');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState<string | undefined>();

  const handleDocumentChange = useCallback((documentId: string) => {
    setCurrentDocument(documentId);
    setHighlightedSection(undefined);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.type as 'user' | 'assistant',
        content: msg.content,
      }));

      const request: ChatRequest = {
        message,
        documentId: currentDocument,
        conversationHistory,
      };

      const response = await aiChatService.sendMessage(request);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response || response.message || 'No response received',
        timestamp: new Date(),
        citations: response.citations,
        message: response.message,
        keyPoints: response.keyPoints,
        confidence: response.confidence,
        followUp: response.followUp,
        showMoreCitations: response.showMoreCitations,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentDocument, messages]);

  const handleCitationClick = useCallback((citation: Citation) => {
    // Find the section that matches the citation
    const currentDoc = sampleDocuments.find(doc => doc.id === citation.documentId);
    if (currentDoc) {
      const section = currentDoc.sections.find(
        s => s.section === citation.section && s.page === citation.page
      );
      if (section) {
        setHighlightedSection(section.id);
        // Clear highlight after 3 seconds
        setTimeout(() => setHighlightedSection(undefined), 3000);
      }
    }
  }, []);

  const handleSectionClick = useCallback((section: DocumentSection) => {
    setHighlightedSection(section.id);
    // Clear highlight after 3 seconds
    setTimeout(() => setHighlightedSection(undefined), 3000);
  }, []);

  const currentSampleQuestions = sampleQuestions[currentDocument as keyof typeof sampleQuestions] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Legal Document Analyzer
              </h1>
              <p className="text-gray-600">
                AI-powered document analysis with precise citations
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Powered by AI • Real-time Analysis
            </div>
          </div>
        </div>
      </header>

      {/* Document Tabs */}
      <DocumentTabs
        documents={sampleDocuments}
        currentDocument={currentDocument}
        onDocumentChange={handleDocumentChange}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - Document Viewer */}
          <div className="h-full">
            <DocumentViewer
              documents={sampleDocuments}
              currentDocument={currentDocument}
              onDocumentChange={handleDocumentChange}
              highlightedSection={highlightedSection}
              onSectionClick={handleSectionClick}
            />
          </div>

          {/* Right Side - Chat Interface */}
          <div className="h-full">
            <EnhancedChatInterface
              onCitationClick={handleCitationClick}
              onSendMessage={handleSendMessage}
              messages={messages}
              isLoading={isLoading}
              sampleQuestions={currentSampleQuestions}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
