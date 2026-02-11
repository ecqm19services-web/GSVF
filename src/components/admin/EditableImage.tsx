import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useEditSession } from '@/contexts/EditSessionContext';
import { Camera, Upload, Loader2 } from 'lucide-react';

type Props = {
  path: string;
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  folder?: string;
};

const EditableImage: React.FC<Props> = ({ path, src, alt = '', className, imgClassName, folder = 'uploads' }) => {
  const session = useEditSession<Record<string, unknown> | unknown[]>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const isEditing = !!session?.isEditing;

  const handleClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewSrc(localUrl);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Get credentials from sessionStorage (same key as useAdminAuth)
      const creds = sessionStorage.getItem('cpvf_admin_auth');
      const headers: Record<string, string> = {};
      if (creds) {
        headers['Authorization'] = `Basic ${creds}`;
      }

      const res = await fetch(`/api/upload-image?folder=${encodeURIComponent(folder)}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      // Update the draft with the new image URL
      session.updateAtPath(path, data.url);
      setPreviewSrc(null);
    } catch (err) {
      console.error('[EditableImage] Upload error:', err);
      setPreviewSrc(null);
      alert('Erreur lors de l\'upload: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    } finally {
      setIsUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const displaySrc = previewSrc || src;

  return (
    <div
      className={cn('relative group', isEditing && 'cursor-pointer', className)}
      onClick={handleClick}
    >
      <img
        src={displaySrc}
        alt={alt}
        className={cn('w-full h-full object-cover', imgClassName)}
      />

      {isEditing && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Overlay */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center transition-all',
            isUploading
              ? 'bg-black/50'
              : 'bg-black/0 group-hover:bg-black/40'
          )}>
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-medium">Upload...</span>
              </div>
            ) : (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Camera className="w-6 h-6 text-gray-900" />
                </div>
                <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">
                  Changer l'image
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EditableImage;
