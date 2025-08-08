import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { DocumentUpload as DocumentUploadType } from '../../types';
import { apiClient } from '../../api/client';

export const DocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentUploadType[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const documentCategories = [
    { value: 'Property Listing', label: 'Property Listing', icon: Home },
    { value: 'Market Report', label: 'Market Report', icon: TrendingUp },
    { value: 'Contract', label: 'Contract', icon: FileCheck },
    { value: 'Inspection', label: 'Inspection Report', icon: FileText },
    { value: 'Other', label: 'Other', icon: File },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    const newDocuments: DocumentUploadType[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      filename: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0,
      uploadedAt: new Date(),
      category: 'Other',
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Simulate upload progress and processing
    for (let i = 0; i < newDocuments.length; i++) {
      const doc = newDocuments[i];
      const file = files[i];

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setDocuments(prev => prev.map(d =>
            d.id === doc.id ? { ...d, progress } : d
          ));
        }

        // Change to processing
        setDocuments(prev => prev.map(d =>
          d.id === doc.id ? { ...d, status: 'processing', progress: 100 } : d
        ));

        // Simulate API call
        await apiClient.uploadDocument(file, doc.category);

        // Mark as completed
        setDocuments(prev => prev.map(d =>
          d.id === doc.id ? { ...d, status: 'completed' } : d
        ));
      } catch (error) {
        setDocuments(prev => prev.map(d =>
          d.id === doc.id ? { ...d, status: 'error' } : d
        ));
      }
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const updateDocumentCategory = (id: string, category: string) => {
    setDocuments(prev => prev.map(d =>
      d.id === id ? { ...d, category } : d
    ));
  };

  const getStatusIcon = (status: DocumentUploadType['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: DocumentUploadType['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
            <p className="text-gray-600 text-sm">Upload property documents, contracts, and reports</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Supported formats: PDF, DOC, DOCX, TXT, MD
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Files
          </label>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(doc.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.filename}
                        </p>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(doc.size)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {(doc.status === 'uploading' || doc.status === 'processing') && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${doc.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Category Selection */}
                      {doc.status === 'completed' && (
                        <div className="mt-3">
                          <label className="text-xs font-medium text-gray-700">Category:</label>
                          <select
                            value={doc.category}
                            onChange={(e) => updateDocumentCategory(doc.id, e.target.value)}
                            className="mt-1 block w-full text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {documentCategories.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
