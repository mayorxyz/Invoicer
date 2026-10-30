import React, { useRef, useState } from 'react';
import { Icon } from '../../components/ui/Icon';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    setError('');
    
    // Check max 6 photos
    if (photos.length + files.length > 6) {
      setError('Maximum 6 photos allowed');
      return;
    }
    
    const newPhotos: string[] = [];
    
    for (const file of files) {
      // Check file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setError('Each photo must be under 2MB');
        continue;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        continue;
      }
      
      try {
        // Downscale to 1200px max
        const dataUrl = await downscaleImage(file, 1200);
        newPhotos.push(dataUrl);
      } catch (err) {
        setError('Failed to process image');
      }
    }
    
    if (newPhotos.length > 0) {
      onChange([...photos, ...newPhotos]);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };
  
  return (
    <div className="border border-rule rounded-md p-3 bg-background/30 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">Photo / Receipt Attachments</label>
        <label className="text-xs font-medium px-2.5 py-1 bg-background border border-rule rounded-md cursor-pointer hover:bg-background/80 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          Choose Files
        </label>
      </div>
      
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Attachment ${index + 1}`}
                className="w-12 h-12 object-cover border border-rule rounded-md"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center"
                aria-label="Remove photo"
              >
                <Icon name="x" size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-[10px] text-muted">Max 6 photos, 2MB each. Images are downscaled to 1200px.</p>
    </div>
  );
}

async function downscaleImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
