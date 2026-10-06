import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export const AdvocateUploadUI: React.FC<{ onUploadSuccess: (url: string) => void }> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;
    
    setUploading(true);
    setError(null);

    try {
      // Secure path: /advocate-verifications/{userId}/id_proof
      const storageRef = ref(storage, `advocate-verifications/${auth.currentUser.uid}/id_proof`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUploadSuccess(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/50">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-red-500" />
        Upload Bar Council ID Proof
      </h3>
      
      <div className="flex flex-col gap-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*,application/pdf"
          className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
        />
        
        {error && (
          <div className="text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold disabled:bg-zinc-700 transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
          {!uploading && <Upload className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
