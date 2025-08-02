import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { FileText, Search, BookOpen } from 'lucide-react';
import type { Document, DocumentSection } from '../data/sampleDocuments';

interface DocumentViewerProps {
  documents: Document[];
  currentDocument: string;
  onDocumentChange: (documentId: string) => void;
  highlightedSection?: string;
  onSectionClick?: (section: DocumentSection) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documents,
  currentDocument,
  highlightedSection,
  onSectionClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('content');

  const currentDoc = documents.find(doc => doc.id === currentDocument);

  const handleSectionClick = (section: DocumentSection) => {
    if (onSectionClick) {
      onSectionClick(section);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg">
      {/* Document Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {currentDoc?.title}
            </h2>
            <span className="text-sm text-gray-500">
              ({currentDoc?.pages} pages)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
          <TabsTrigger
            value="content"
            className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Document Content
          </TabsTrigger>
          <TabsTrigger
            value="sections"
            className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Sections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {currentDoc?.sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    highlightedSection === section.id
                      ? 'document-highlight border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Section {section.section}: {section.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Page {section.page}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sections" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {currentDoc?.sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    highlightedSection === section.id
                      ? 'document-highlight border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Section {section.section}: {section.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Page {section.page} • Paragraph {section.paragraph}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {section.content.length} chars
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentViewer;
