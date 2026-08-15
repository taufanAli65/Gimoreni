import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useMe } from '../../../domains/users/hooks/useMe';
import { useUpdateMe } from '../../../domains/users/hooks/useUpdateMe';
import { useAvatarUpload } from '../../../domains/users/hooks/useAvatarUpload';
import { UserAvatar } from '../../components/UserAvatar';
import { toast } from 'sonner';

export const ProfileSection = () => {
  const { data: profile, isLoading } = useMe();
  const { mutate: updateMe, isPending: saving } = useUpdateMe();
  const { isUploading, fileInputRef, handleFileChange } = useAvatarUpload(
    profile?.id ?? ''
  );

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('');

  const handleEditName = () => {
    setName(profile?.name ?? '');
    setEditingName(true);
  };

  const handleSaveName = () => {
    if (!name.trim()) return;
    updateMe(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success('Name updated!');
          setEditingName(false);
        },
        onError: () => toast.error('Failed to update name'),
      }
    );
  };

  if (isLoading) {
    return <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        {/* Avatar with upload trigger */}
        <div className="relative">
          <UserAvatar name={profile?.name ?? ''} avatarUrl={profile?.avatarUrl} size="lg" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2D6A4F] rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#1B4332] transition-colors"
            aria-label="Upload avatar"
          >
            {isUploading
              ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              : <Camera className="w-3.5 h-3.5 text-white" />
            }
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Name + edit */}
        <div className="flex-1 min-w-0">
          {editingName ? (
            <div className="flex gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788]"
              />
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="text-xs bg-[#2D6A4F] text-white px-3 py-1.5 rounded-lg hover:bg-[#1B4332] disabled:opacity-50"
              >
                {saving ? '...' : 'Save'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800 truncate">{profile?.name}</p>
              <button
                onClick={handleEditName}
                className="text-xs text-[#52B788] hover:underline shrink-0"
              >
                Edit
              </button>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{profile?.email}</p>
          <span className="inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full font-semibold">
            {profile?.role}
          </span>
        </div>
      </div>
    </div>
  );
};
