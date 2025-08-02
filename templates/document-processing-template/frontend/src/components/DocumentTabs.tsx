import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { FileText, Building, Users, ShoppingCart, Wrench, Handshake } from 'lucide-react';
import type { Document } from '../data/sampleDocuments';

interface DocumentTabsProps {
  documents: Document[];
  currentDocument: string;
  onDocumentChange: (documentId: string) => void;
}

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'Lease':
      return <Building className="w-4 h-4" />;
    case 'Employment':
      return <Users className="w-4 h-4" />;
    case 'Purchase':
      return <ShoppingCart className="w-4 h-4" />;
    case 'Service':
      return <Wrench className="w-4 h-4" />;
    case 'Partnership':
      return <Handshake className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const DocumentTabs: React.FC<DocumentTabsProps> = ({
  documents,
  currentDocument,
  onDocumentChange
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <Tabs value={currentDocument} onValueChange={onDocumentChange}>
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1">
          {documents.map((doc) => (
            <TabsTrigger
              key={doc.id}
              value={doc.id}
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm hover:bg-gray-50"
            >
              {getDocumentIcon(doc.type)}
              <span className="hidden sm:inline">{doc.title}</span>
              <span className="sm:hidden">{doc.type}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DocumentTabs;
