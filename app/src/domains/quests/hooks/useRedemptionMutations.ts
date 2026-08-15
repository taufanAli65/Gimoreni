import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import { supabase } from '../../../shared/lib/supabase';
import { compressImage } from '../../../shared/lib/imageCompression';
import type { QuestRedemption } from '../types';
import { useAuth } from '../../../shared/hooks/useAuth';

interface SubmitRedemptionParams {
  questId: string;
  proofFile?: File;
  proofNote?: string;
}

interface RejectRedemptionParams {
  id: string;
  rejectionNote: string;
}

export const useRedemptionMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const submitRedemption = useMutation({
    mutationFn: async ({ questId, proofFile, proofNote }: SubmitRedemptionParams) => {
      let proofUrl = null;

      if (proofFile && user) {
        const compressedFile = await compressImage(proofFile);
        const fileName = `${Date.now()}-${compressedFile.name}`;
        const filePath = `${user.supabaseUserId}/${fileName}`;
        
        const { error } = await supabase.storage
          .from('redemption-proofs')
          .upload(filePath, compressedFile);

        if (error) {
          throw new Error('Failed to upload proof image');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('redemption-proofs')
          .getPublicUrl(filePath);
          
        proofUrl = publicUrl;
      }

      const res = await api.post<{ success: boolean; data: QuestRedemption }>('/redemptions', {
        questId,
        proofUrl,
        proofNote,
      });

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  const approveRedemption = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<{ success: boolean; data: QuestRedemption }>(`/redemptions/${id}/approve`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['active-quest'] });
    },
  });

  const rejectRedemption = useMutation({
    mutationFn: async ({ id, rejectionNote }: RejectRedemptionParams) => {
      const res = await api.patch<{ success: boolean; data: QuestRedemption }>(`/redemptions/${id}/reject`, {
        rejectionNote,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  return {
    submitRedemption,
    approveRedemption,
    rejectRedemption,
  };
};
