import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Send, Loader2, FileText, MessageSquare, ArrowLeft, BookOpen, Search, FileSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { getApiUrl } from '../config/api';

// Enhanced sample documents data with structured sections
const sampleDocuments = [
  {
    id: 'lease-agreement',
    title: 'Commercial Lease Agreement',
    sections: [
      {
        id: 'lease-1-1',
        section: '1.1',
        page: 1,
        content: 'This Commercial Lease Agreement (the "Lease") is entered into on January 15, 2024, between ABC Properties LLC ("Landlord") and TechStart Inc. ("Tenant").'
      },
      {
        id: 'lease-2-1',
        section: '2.1',
        page: 2,
        content: 'Tenant shall pay to Landlord as monthly rent for the Premises the sum of Eight Thousand Five Hundred Dollars ($8,500.00) per month, due on the first day of each month during the term of this Lease.'
      },
      {
        id: 'lease-2-2',
        section: '2.2',
        page: 2,
        content: 'Rent shall be paid by check or electronic transfer to Landlord at the address specified in Section 1.1, or such other address as Landlord may designate in writing.'
      },
      {
        id: 'lease-3-1',
        section: '3.1',
        page: 3,
        content: 'The term of this Lease shall be 36 months, commencing on February 1, 2024, and ending on January 31, 2027, unless terminated earlier in accordance with the provisions of this Lease.'
      },
      {
        id: 'lease-4-1',
        section: '4.1',
        page: 4,
        content: 'Tenant shall use the Premises solely for office and administrative purposes and shall not use the Premises for any other purpose without Landlord\'s prior written consent.'
      },
      {
        id: 'lease-5-1',
        section: '5.1',
        page: 5,
        content: 'If Tenant desires to terminate this Lease prior to the Expiration Date, Tenant must provide Landlord with written notice at least ninety (90) days in advance. Tenant shall remain liable for rent payments until the termination date and shall pay a termination fee equal to two (2) months\' rent.'
      },
      {
        id: 'lease-6-1',
        section: '6.1',
        page: 6,
        content: 'Tenant shall be responsible for all utilities, including electricity, water, gas, and internet service. Landlord shall provide heating and air conditioning during normal business hours.'
      },
      {
        id: 'lease-7-1',
        section: '7.1',
        page: 7,
        content: 'Tenant shall maintain the Premises in good condition and repair, ordinary wear and tear excepted. Tenant shall not make any alterations or improvements without Landlord\'s prior written consent.'
      }
    ]
  },
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    sections: [
      {
        id: 'emp-1-1',
        section: '1.1',
        page: 1,
        content: 'This Employment Agreement (the "Agreement") is entered into on March 1, 2024, between Innovation Corp ("Employer") and Sarah Johnson ("Employee").'
      },
      {
        id: 'emp-2-1',
        section: '2.1',
        page: 2,
        content: 'Employee shall serve as Senior Software Engineer and shall perform such duties as are customarily associated with such position and as may be assigned by Employer from time to time.'
      },
      {
        id: 'emp-3-1',
        section: '3.1',
        page: 3,
        content: 'Employee shall receive an annual base salary of One Hundred Twenty-Five Thousand Dollars ($125,000.00), payable in accordance with the Company\'s normal payroll practices.'
      },
      {
        id: 'emp-3-2',
        section: '3.2',
        page: 3,
        content: 'Employee shall be eligible for an annual performance bonus of up to 20% of base salary, based on individual and company performance metrics.'
      },
      {
        id: 'emp-4-1',
        section: '4.1',
        page: 4,
        content: 'Employee shall be entitled to twenty (20) days of paid vacation per year, which shall accrue monthly and may be taken with reasonable notice to Employer.'
      },
      {
        id: 'emp-4-2',
        section: '4.2',
        page: 4,
        content: 'Employee shall be eligible for health insurance, dental insurance, vision insurance, and participation in the Company\'s 401(k) retirement plan with matching contributions up to 6% of salary.'
      },
      {
        id: 'emp-5-1',
        section: '5.1',
        page: 5,
        content: 'This Agreement shall commence on April 1, 2024, and shall continue until terminated by either party in accordance with the provisions of this Agreement.'
      },
      {
        id: 'emp-6-1',
        section: '6.1',
        page: 6,
        content: 'Either party may terminate this Agreement with thirty (30) days written notice. Employer may terminate immediately for cause, including but not limited to misconduct, poor performance, or violation of company policies.'
      }
    ]
  },
  {
    id: 'purchase-agreement',
    title: 'Purchase Agreement',
    sections: [
      {
        id: 'purchase-1-1',
        section: '1.1',
        page: 1,
        content: 'This Purchase Agreement (the "Agreement") is entered into on February 15, 2024, between ABC Manufacturing Inc. ("Seller") and XYZ Distribution LLC ("Buyer").'
      },
      {
        id: 'purchase-2-1',
        section: '2.1',
        page: 2,
        content: 'Seller agrees to sell and Buyer agrees to purchase the following equipment (the "Equipment"): Industrial Manufacturing Line Model X-2000, Serial Number 2024-001.'
      },
      {
        id: 'purchase-2-2',
        section: '2.2',
        page: 2,
        content: 'The total purchase price for the Equipment shall be Two Hundred Fifty Thousand Dollars ($250,000.00), payable as follows: $50,000.00 upon execution of this Agreement (the "Deposit") and $200,000.00 upon delivery.'
      },
      {
        id: 'purchase-3-1',
        section: '3.1',
        page: 3,
        content: 'Delivery of the Equipment shall be made to Buyer\'s facility at 123 Industrial Blvd, Manufacturing City, NV 89101, on or before April 15, 2024.'
      },
      {
        id: 'purchase-4-1',
        section: '4.1',
        page: 4,
        content: 'Seller warrants that the Equipment shall be free from defects in materials and workmanship for a period of 12 months from the date of delivery.'
      },
      {
        id: 'purchase-5-1',
        section: '5.1',
        page: 5,
        content: 'Title to the Equipment shall pass to Buyer upon delivery. Risk of loss shall pass to Buyer upon delivery.'
      },
      {
        id: 'purchase-6-1',
        section: '6.1',
        page: 6,
        content: 'If Buyer fails to make any payment when due or fails to perform any other obligation under this Agreement, Seller may terminate this Agreement and retain the Deposit as liquidated damages.'
      }
    ]
  },
  {
    id: 'service-agreement',
    title: 'Service Agreement',
    sections: [
      {
        id: 'service-1-1',
        section: '1.1',
        page: 1,
        content: 'This Service Agreement (the "Agreement") is entered into on May 1, 2024, between TechSolutions Inc. ("Service Provider") and Global Retail Corp ("Client").'
      },
      {
        id: 'service-2-1',
        section: '2.1',
        page: 2,
        content: 'Service Provider agrees to provide the following services to Client: Website development and maintenance, Mobile application development, IT consulting and support, Data analytics and reporting.'
      },
      {
        id: 'service-3-1',
        section: '3.1',
        page: 3,
        content: 'Client shall pay Service Provider a monthly fee of Fifteen Thousand Dollars ($15,000.00) for the Services. For any services not included in the monthly fee, Service Provider shall charge Client at the rate of One Hundred Fifty Dollars ($150.00) per hour.'
      },
      {
        id: 'service-3-2',
        section: '3.2',
        page: 3,
        content: 'Payment shall be due within 30 days of receipt of invoice. Late payments shall incur interest at the rate of 1.5% per month.'
      },
      {
        id: 'service-4-1',
        section: '4.1',
        page: 4,
        content: 'Service Provider shall maintain 99.9% uptime for all hosted services and shall respond to support requests within 4 hours during business hours.'
      },
      {
        id: 'service-5-1',
        section: '5.1',
        page: 5,
        content: 'This Agreement shall commence on May 15, 2024, and shall continue for a period of 24 months, unless terminated earlier in accordance with the provisions of this Agreement.'
      },
      {
        id: 'service-6-1',
        section: '6.1',
        page: 6,
        content: 'Either party may terminate this Agreement for material breach if such breach is not cured within 30 days of written notice. Client may terminate this Agreement for convenience upon 60 days written notice.'
      }
    ]
  },
  {
    id: 'partnership-agreement',
    title: 'Partnership Agreement',
    sections: [
      {
        id: 'partnership-1-1',
        section: '1.1',
        page: 1,
        content: 'This Partnership Agreement (the "Agreement") is entered into on June 1, 2024, between John Smith ("Partner A") and Maria Garcia ("Partner B") for the formation of a general partnership.'
      },
      {
        id: 'partnership-2-1',
        section: '2.1',
        page: 2,
        content: 'The partnership shall be known as "Smith & Garcia Consulting" and shall engage in the business of management consulting services.'
      },
      {
        id: 'partnership-3-1',
        section: '3.1',
        page: 3,
        content: 'Each partner shall contribute Fifty Thousand Dollars ($50,000.00) as initial capital to the partnership. Additional capital contributions may be required by unanimous consent of the partners.'
      },
      {
        id: 'partnership-4-1',
        section: '4.1',
        page: 4,
        content: 'Profits and losses shall be shared equally between the partners (50% each), unless otherwise agreed in writing.'
      },
      {
        id: 'partnership-5-1',
        section: '5.1',
        page: 5,
        content: 'Each partner shall devote their full time and attention to the partnership business and shall not engage in any other business activities without the written consent of the other partner.'
      },
      {
        id: 'partnership-6-1',
        section: '6.1',
        page: 6,
        content: 'Major decisions affecting the partnership, including but not limited to hiring employees, entering into contracts over $25,000, and borrowing money, shall require unanimous consent of all partners.'
      },
      {
        id: 'partnership-7-1',
        section: '7.1',
        page: 7,
        content: 'This partnership shall continue until terminated by mutual agreement of the partners or by the death, disability, or withdrawal of any partner.'
      }
    ]
  }
];

// Sample questions for each document
const sampleQuestions = {
  'lease-agreement': [
    "What is the monthly rent for this lease?",
    "What are the tenant's responsibilities for maintenance?",
    "Can the tenant sublet the premises?",
    "What happens if the tenant doesn't pay rent on time?",
    "What utilities are included in the lease?"
  ],
  'employment-contract': [
    "What is the employee's annual salary?",
    "What benefits is the employee eligible for?",
    "What is the non-compete period?",
    "How much notice is required for termination?",
    "What happens to intellectual property created during employment?"
  ],
  'purchase-agreement': [
    "What is the total purchase price?",
    "What equipment is being purchased?",
    "What is the delivery date?",
    "What warranties are provided?",
    "What happens if the buyer doesn't pay?"
  ],
  'service-agreement': [
    "What services are being provided?",
    "What is the monthly fee?",
    "What are the service level requirements?",
    "How can the agreement be terminated?",
    "Who owns the intellectual property?"
  ],
  'partnership-agreement': [
    "What is the business purpose of the partnership?",
    "How are profits and losses shared?",
    "What contributions did each partner make?",
    "How is the partnership managed?",
    "What happens if a partner wants to leave?"
  ]
};

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  citations?: Array<{
    documentId: string;
    section: string;
    page: number;
    text?: string;
    display?: string;
    reference?: string;
    fullText?: string;
  }>;
}

const DocumentAnalyzerDemo: React.FC = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const [currentDocument, setCurrentDocument] = useState('lease-agreement');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedSection, setHighlightedSection] = useState<string | undefined>();

  // Auto-scroll functionality - ONLY within chat container
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');

    try {
      // Call the Supabase Edge Function with fallback to local development
      const apiUrl = getApiUrl('documentAnalyzer');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Add authorization header with fallback anon key
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa3p0aGF2cHVwZ3BidXNxaHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTM0MTgsImV4cCI6MjA2OTc4OTQxOH0.PKWpeC4dfdqUS25STLFEIzlwmW_ZDIyQ9ZezPcrnke8';
      headers['Authorization'] = `Bearer ${anonKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: message,
          document_id: currentDocument,
          conversation_history: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        citations: data.citations || [],
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
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

    const handleCitationClick = (citation: ChatMessage['citations'][0]) => {
    // Highlight the cited section and scroll to it
    setHighlightedSection(citation.documentId + '-' + citation.section.replace('.', '-'));

    // Scroll to the section after a brief delay to ensure the highlight is applied


    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightedSection(undefined);
    }, 3000);
  };

  const handleSectionClick = (section: { id: string; section: string; page: number; content: string }) => {
    // Highlight the section when clicked
    setHighlightedSection(section.id);

    // Remove highlight after 2 seconds
    setTimeout(() => {
      setHighlightedSection(undefined);
    }, 2000);
  };

  const currentSampleQuestions = sampleQuestions[currentDocument as keyof typeof sampleQuestions] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => {
              // Clear saved scroll position for main page
              const savedPositions = sessionStorage.getItem('scrollPositions');
              if (savedPositions) {
                try {
                  const positions = JSON.parse(savedPositions);
                  delete positions['/'];
                  sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
                } catch (error) {
                  console.warn('Failed to clear scroll position:', error);
                }
              }
              navigate('/');
            }}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Legal Document Analyzer Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our advanced AI-powered document analysis system with precise citations and cross-document intelligence. This system provides sophisticated legal document understanding and citation linking.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">
              {/* Left Side - Document Viewer */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Viewer
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <Tabs value={currentDocument} onValueChange={setCurrentDocument}>
                    <TabsList className="grid w-full grid-cols-5">
                      {sampleDocuments.map((doc) => (
                        <TabsTrigger key={doc.id} value={doc.id} className="text-xs">
                          {doc.title.split(' ')[0]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {sampleDocuments.map((doc) => (
                      <TabsContent key={doc.id} value={doc.id} className="mt-4">
                        <ScrollArea className="h-[500px] w-full border rounded-md p-4">
                          <div className="space-y-4">
                            {doc.sections.map((section) => (
                              <div
                                key={section.id}
                                id={section.id}
                                className={`p-3 rounded-md border transition-all duration-300 cursor-pointer ${
                                  highlightedSection === section.id
                                    ? 'bg-blue-100 border-blue-300 shadow-md'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => handleSectionClick(section)}
                              >
                                <h4 className="font-semibold text-gray-800 mb-2">
                                  Section {section.section} (Page {section.page})
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {section.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Right Side - FIXED AI Chat Assistant */}
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      AI Chat Assistant
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMessages([]);
                        setInputValue('');
                        setHighlightedSection(undefined);
                      }}
                      className="text-xs px-3 py-1 h-8"
                    >
                      Start New Chat
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0 p-6">
                  {/* Sample Questions - Enhanced Design */}
                  <div className="mb-6 flex-shrink-0">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Try asking:</h4>
                    <div className="flex flex-wrap gap-3">
                      {currentSampleQuestions.slice(0, 3).map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(question)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg text-sm text-blue-700 hover:text-blue-800 transition-all duration-200 hover:shadow-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Chat Interface - FIXED HEIGHT, NO EXPANDING */}
                  <div className="flex-1 bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm flex flex-col min-h-0 max-h-[500px]">
                                        {/* Messages Area - SCROLLABLE */}
                    <div
                      ref={messagesContainerRef}
                      className="flex-1 p-4 overflow-y-auto min-h-0"
                    >
                      <div className="space-y-3">
                        {messages.length === 0 && !isLoading && (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-center max-w-md">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                              </div>
                              <div className="text-gray-600 font-medium mb-2">Ready to help you analyze</div>
                              <div className="text-sm text-gray-500">Ask me anything about your document and I'll provide detailed insights</div>
                            </div>
                          </div>
                        )}
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${
                            message.type === 'user' ? 'justify-end' : 'justify-start'
                          }`}>
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-4'
                                : 'bg-white border border-gray-200 text-gray-800 mr-4'
                            }`}>
                              <div className="text-sm leading-relaxed">{message.content}</div>

                              {/* Citations for AI messages */}
                              {message.type === 'ai' && message.citations && Array.isArray(message.citations) && message.citations.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="text-xs text-gray-500 mb-2">Sources:</div>
                                  <div className="space-y-1">
                                    {message.citations.map((citation, index) => (
                                      <button
                                        key={index}
                                        onClick={() => handleCitationClick(citation)}
                                        className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                      >
                                        <span className="font-medium">Section {citation.section}</span>
                                        <span className="text-gray-500 ml-2">(Page {citation.page})</span>
                                        <div className="text-gray-600 mt-1 truncate">
                                          {citation.display || citation.text || citation.fullText || 'Citation text not available'}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                              <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-sm text-gray-600">AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Input Bar - Fixed at bottom */}
                    <div className="flex-shrink-0 p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                      <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about this document..."
                            className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 placeholder-gray-400"
                            disabled={isLoading}
                          />
                        </div>
                        <button
                          onClick={() => handleSendMessage(inputValue)}
                          disabled={isLoading || !inputValue.trim()}
                          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DocumentAnalyzerDemo;
