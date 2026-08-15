import { useState, useRef } from 'react';
import { compressImage } from '../../../shared/lib/imageCompression';
import { supabase } from '../../../shared/lib/supabase';
import { useMe } from '../../auth/hooks/useMe';
import { toast } from 'sonner';

interface ReceiptUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: Error) => void;
}

export const ReceiptUpload = ({ onUploadSuccess, onUploadError }: ReceiptUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: authData } = useMe();
  const user = authData?.user;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // 1. Compress Image
      const compressedFile = await compressImage(file);
      
      // Display preview
      const objectUrl = URL.createObjectURL(compressedFile);
      setPreview(objectUrl);

      // 2. Upload to Supabase Storage
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = user?.supabaseUserId ? `${user.supabaseUserId}/${fileName}` : fileName;

      // Ensure the 'receipts' bucket is created in Supabase!
      const { error } = await supabase.storage
        .from('receipts')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      onUploadSuccess(publicUrl);
      toast.success('Receipt uploaded successfully');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Failed to upload receipt');
      if (onUploadError) onUploadError(err);
      setPreview(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">Receipt (Optional)</label>
      
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Choose Image'}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {preview && (
          <div className="relative w-16 h-16 rounded overflow-hidden border border-gray-200">
            <img src={preview} alt="Receipt preview" className="object-cover w-full h-full" />
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500">Image will be compressed to save space (&le; 500KB).</p>
    </div>
  );
};
