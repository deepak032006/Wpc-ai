'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import clientApi from '@/lib/axios';

interface Document {
  id: string;
  document_name: string;
  document_file: File;
}

export default function BulkUpload() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocName, setCurrentDocName] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB) cuz not more than this :)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }
      setCurrentFile(file);
    }
  };

  const handleAddDocument = () => {
    if (!currentDocName.trim()) {
      toast.error('Please enter document name');
      return;
    }

    if (!currentFile) {
      toast.error('Please select a file');
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      document_name: currentDocName,
      document_file: currentFile,
    };

    setDocuments([...documents, newDoc]);
    setCurrentDocName('');
    setCurrentFile(null);
    
    // Reset file input for reset but not from the backend as for now
    const fileInput = document.getElementById('additional-doc-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    
    toast.success('Document added to queue');
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success('Document removed');
  };

  const handleUploadAll = async () => {
    if (documents.length === 0) {
      toast.error('Please add at least one document');
      return;
    }

    setUploading(true);

    try {
      // Create a single FormData with all documents
      const formData = new FormData();
      
      // Add each document with indexed field names
      documents.forEach((doc, index) => {
        formData.append(`documents[${index}][documnet_name]`, doc.document_name.trim());
        formData.append(`documents[${index}][document_file]`, doc.document_file);
      });

      // documents.forEach((doc) => {
      //   formData.append('documnet_names[]', doc.document_name.trim());
      //   formData.append('document_files[]', doc.document_file);
      // });

      console.log('Uploading documents:', documents.length);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      // Upload all at once
      const response = await clientApi.post('/api/candidate/add/additional_document/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);

      toast.success(`${documents.length} document${documents.length > 1 ? 's' : ''} uploaded successfully!`);
      setDocuments([]);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.response?.data?.detail
        || 'Failed to upload documents. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 mt-8 pt-8 border-t border-[#E0E0E0]">
      <div>
        <h3 className="text-[18px] text-[#111111] font-bold mb-1">
          Additional Documents
        </h3>
        <p className="text-[14px] text-[#636363]">
          Add multiple documents and upload them together
        </p>
      </div>

      {/* Document Name Input */}
      <div>
        <label className="block text-[18px] text-[#111111] font-medium mb-2">
          Document Name
        </label>
        <input
          type="text"
          value={currentDocName}
          onChange={(e) => setCurrentDocName(e.target.value)}
          placeholder="e.g., Reference Letter, Certificate..."
          className="w-full px-4 py-3 border border-[#C5C6C8] rounded-lg text-[16px] focus:outline-none focus:border-primary"
          disabled={uploading}
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-[18px] text-[#111111] font-medium mb-2">
          Document File
        </label>
        
        {currentFile ? (
          <div className="w-full shadow-sm shadow-[#0A65CC14] border border-[#0852C9] rounded-lg py-3 px-5.5 flex items-center justify-between bg-[#F5FAFF]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#0A65CC] flex items-center justify-center">
                <svg
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4.5L4.5 8L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-[3px]">
                <span className="text-sm font-medium text-[18px] text-[#373737]">
                  {currentFile.name}
                </span>
                <span className="text-[16px] text-[#636363]">
                  {(currentFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentFile(null)}
              className="text-[16px] text-[#636363] hover:text-[#101828] transition"
              type="button"
              disabled={uploading}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#C5C6C8] rounded-xl p-4 text-center hover:border-primary transition">
            <input
              id="additional-doc-upload"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp,.mp4,.mov,.avi"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label htmlFor="additional-doc-upload" className={`cursor-pointer flex items-center justify-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Plus className="w-5 h-5 text-primary" />
              <span className="text-primary text-[16px] font-medium">
                Add File
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Add to Queue Button */}
      <button
        onClick={handleAddDocument}
        type="button"
        disabled={uploading}
        className="w-full bg-[#DFEEFF] text-primary py-3 text-[16px] lg:text-[18px] rounded-lg font-semibold hover:bg-[#c5e3ff] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        + Add to Queue
      </button>

      {/* Documents Queue */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[16px] font-semibold text-[#111]">
            Documents Queue ({documents.length})
          </h4>
          
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-[#E0E0E0] rounded-lg p-4 flex items-center justify-between bg-[#FAFAFA]"
            >
              <div className="flex-1">
                <p className="text-[16px] font-medium text-[#111]">
                  {doc.document_name}
                </p>
                <p className="text-[14px] text-[#636363] mt-1">
                  {doc.document_file.name} • {(doc.document_file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              
              <button
                onClick={() => handleRemoveDocument(doc.id)}
                className="ml-4 p-2 text-[#636363] hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                type="button"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* Upload All Button */}
          <button
            onClick={handleUploadAll}
            disabled={uploading}
            type="button"
            className="w-full bg-primary text-white py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold hover:bg-[#0952b8] transition disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
          >
            {uploading ? 'Uploading...' : `Upload ${documents.length} Document${documents.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {documents.length === 0 && (
        <div className="text-center py-4 text-[#636363]">
          <p className="text-[14px]">No documents in queue</p>
        </div>
      )}
    </div>
  );
}