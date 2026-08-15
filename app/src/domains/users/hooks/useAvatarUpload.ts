import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { compressImage } from '../../../shared/lib/imageCompression';
import { supabase } from '../../../shared/lib/supabase';
import { api } from '../../../shared/lib/api';
import { toast } from 'sonner';

/**
 * Handles the full avatar upload flow:
 * 1. Compress image (≤ 500KB, per image policy)
 * 2. Upload to Supabase Storage 'avatars' bucket
 * 3. PATCH /users/me with the public URL
 */
export const useAvatarUpload = (userId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updateMeMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const { data } = await api.patch('/users/me', { avatarUrl });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // 1. Compress image — mandatory per image policy
      const compressed = await compressImage(file);

      // 2. Upload to Supabase Storage
      const ext = compressed.name.split('.').pop();
      const filePath = `${userId}/avatar_${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressed, { upsert: true });

      if (error) throw error;

      // 3. Get public URL and PATCH /users/me
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await updateMeMutation.mutateAsync(publicUrl);
      toast.success('Avatar updated!');
    } catch (err) {
      console.error('Avatar upload failed:', err);
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return { isUploading, fileInputRef, handleFileChange };
};
