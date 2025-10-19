'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  AlertCircle,
  CheckCircle,
  FileImage
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ThumbnailUploaderProps {
  onThumbnailsUploaded: (files: File[]) => void;
  maxFiles?: number;
  acceptedFormats?: string[];
}

export default function ThumbnailUploader({ 
  onThumbnailsUploaded, 
  maxFiles = 6,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: ThumbnailUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([]);
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(({ file, errors }) => {
        const errorMessages = errors.map((error: any) => {
          switch (error.code) {
            case 'file-invalid-type':
              return `${file.name}: Invalid file type. Please use JPG, PNG, or WebP.`;
            case 'file-too-large':
              return `${file.name}: File too large. Maximum size is 10MB.`;
            case 'too-many-files':
              return `Too many files. Maximum ${maxFiles} files allowed.`;
            default:
              return `${file.name}: ${error.message}`;
          }
        });
        return errorMessages.join(' ');
      });
      setErrors(newErrors);
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles);
      setUploadedFiles(newFiles);
      onThumbnailsUploaded(newFiles);
    }
  }, [uploadedFiles, maxFiles, onThumbnailsUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - uploadedFiles.length,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onThumbnailsUploaded(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileStatus = (file: File) => {
    const issues: string[] = [];
    
    if (file.size > 2 * 1024 * 1024) {
      issues.push('Large file size');
    }
    
    if (!acceptedFormats.includes(file.type)) {
      issues.push('Unsupported format');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive 
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
            : "border-slate-300 dark:border-slate-600 hover:border-purple-400",
          uploadedFiles.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        {uploadedFiles.length === 0 ? (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-slate-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Upload Thumbnails to Compare
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Drag and drop {maxFiles} thumbnail images or click to browse
              </p>
              <button 
                type="button"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Choose Files
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {uploadedFiles.length} Thumbnail{uploadedFiles.length !== 1 ? 's' : ''} Uploaded
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {uploadedFiles.length < maxFiles 
                  ? `Upload ${maxFiles - uploadedFiles.length} more to compare`
                  : 'Ready to analyze!'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Upload Issues
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
            Uploaded Thumbnails
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => {
              const status = getFileStatus(file);
              const imageUrl = URL.createObjectURL(file);
              
              return (
                <div
                  key={index}
                  className="relative group border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                >
                  {/* Image Preview */}
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800">
                    <img
                      src={imageUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* File Info */}
                  <div className="p-3 bg-white dark:bg-slate-800">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-2">
                        {status.isValid ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Status Issues */}
                    {!status.isValid && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {status.issues.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Requirements */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 dark:text-white mb-2">
          Thumbnail Requirements
        </h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• Format: JPG, PNG, or WebP</li>
          <li>• Size: Maximum 10MB per file</li>
          <li>• Resolution: 1280x720 or higher recommended</li>
          <li>• Aspect Ratio: 16:9 for best results</li>
          <li>• Maximum {maxFiles} thumbnails per comparison</li>
        </ul>
      </div>
    </div>
  );
}
