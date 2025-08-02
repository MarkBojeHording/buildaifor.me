import React, { useState } from 'react';
import { Upload, Mic, Camera, FileText, Image, Video, Music, Download, Play, Pause, Volume2 } from 'lucide-react';

const MultiModal = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f =>
          f.id === file.id
            ? { ...f, progress: Math.min(f.progress + 10, 100) }
            : f
        ));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => prev.map(f =>
          f.id === file.id
            ? { ...f, status: 'completed' }
            : f
        ));
      }, 2000);
    });
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setUploadedFiles(prev => [...prev, {
        id: Date.now(),
        name: 'Voice Message.wav',
        type: 'audio/wav',
        size: '2.4 MB',
        status: 'completed',
        progress: 100
      }]);
    }, 3000);
  };

  const analyzeFiles = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAnalysisResults({
        documents: [
          { name: 'Contract.pdf', insights: ['Payment terms identified', 'Key dates extracted', 'Risk factors highlighted'] },
          { name: 'Invoice.pdf', insights: ['Amount: $12,500', 'Due date: 30 days', 'Payment method: Bank transfer'] }
        ],
        images: [
          { name: 'receipt.jpg', insights: ['Total: $156.78', 'Date: 2024-01-15', 'Merchant: Office Supplies Co'] }
        ],
        audio: [
          { name: 'Voice Message.wav', insights: ['Meeting request identified', 'Date: Tomorrow 2 PM', 'Attendees: John, Sarah'] }
        ]
      });
      setIsProcessing(false);
    }, 3000);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (type.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (type.startsWith('audio/')) return <Music className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* File Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Multi-Modal Input</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 mb-2">Upload Files</h3>
            <p className="text-sm text-gray-600 mb-4">Documents, images, videos</p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
            >
              Choose Files
            </label>
          </div>

          {/* Voice Recording */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Mic className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 mb-2">Voice Input</h3>
            <p className="text-sm text-gray-600 mb-4">Record audio messages</p>
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`px-4 py-2 rounded-lg ${
                isRecording
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
          </div>

          {/* Camera Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 mb-2">Camera Capture</h3>
            <p className="text-sm text-gray-600 mb-4">Take photos or videos</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Open Camera
            </button>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Uploaded Files</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {file.status === 'uploading' && (
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    )}
                    <span className={`text-sm font-medium ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {uploadedFiles.length > 0 && (
          <button
            onClick={analyzeFiles}
            disabled={isProcessing}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isProcessing ? 'Analyzing Files...' : 'Analyze All Files'}
          </button>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Analysis Results</h3>

          <div className="space-y-6">
            {/* Documents */}
            {analysisResults.documents.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Documents
                </h4>
                <div className="space-y-3">
                  {analysisResults.documents.map((doc, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">{doc.name}</p>
                      <ul className="space-y-1">
                        {doc.insights.map((insight, insightIndex) => (
                          <li key={insightIndex} className="text-sm text-gray-700 flex items-center">
                            <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {analysisResults.images.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-green-600" />
                  Images
                </h4>
                <div className="space-y-3">
                  {analysisResults.images.map((img, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">{img.name}</p>
                      <ul className="space-y-1">
                        {img.insights.map((insight, insightIndex) => (
                          <li key={insightIndex} className="text-sm text-gray-700 flex items-center">
                            <div className="w-1 h-1 bg-green-600 rounded-full mr-2"></div>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio */}
            {analysisResults.audio.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Music className="w-5 h-5 mr-2 text-purple-600" />
                  Audio
                </h4>
                <div className="space-y-3">
                  {analysisResults.audio.map((audio, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{audio.name}</p>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-purple-600 hover:text-purple-700">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-purple-600 hover:text-purple-700">
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {audio.insights.map((insight, insightIndex) => (
                          <li key={insightIndex} className="text-sm text-gray-700 flex items-center">
                            <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Create Summary Report
            </button>
            <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700">
              Export Results
            </button>
          </div>
        </div>
      )}

      {/* Advanced Features */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Advanced Multi-Modal Features</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">OCR Processing</h4>
            <p className="text-sm text-gray-600">Extract text from images and documents with high accuracy</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Voice Recognition</h4>
            <p className="text-sm text-gray-600">Convert speech to text with speaker identification</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Image Analysis</h4>
            <p className="text-sm text-gray-600">Object detection, text extraction, and visual insights</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Document Intelligence</h4>
            <p className="text-sm text-gray-600">Smart document parsing and data extraction</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Video Processing</h4>
            <p className="text-sm text-gray-600">Video analysis and frame-by-frame insights</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Multi-Language Support</h4>
            <p className="text-sm text-gray-600">Process content in 50+ languages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiModal;
