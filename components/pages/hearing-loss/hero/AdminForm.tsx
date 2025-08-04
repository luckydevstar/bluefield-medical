'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { UploadDropzone } from '@/src/utils/uploadthing';
import { HeroData } from './View';

interface HeroAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeroData;
  onSave: (data: HeroData) => void;
}

export function HearingLossHeroAdminForm({ isOpen, onClose, data, onSave }: HeroAdminFormProps) {
  const [formData, setFormData] = useState<HeroData>(data);

  const handleChange = <K extends keyof HeroData>(key: K, value: HeroData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Edit Hero</DrawerTitle>
          <DrawerDescription>Update the title, image, and CTA</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter hero title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" value={formData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} placeholder="Enter subtitle" />
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            {formData.image?.url && (
              <div className="mb-2">
                <img
                  src={formData.image.url}
                  alt="hero preview"
                  className="w-full max-h-48 object-cover rounded-md"
                />
              </div>
            )}
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  const { key, url } = res[0];
                  handleChange('image', { key, url });
                }
              }}
              onUploadError={(err) => {
                console.error('Upload error:', err.message);
                alert('Image upload failed');
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaText">CTA Text</Label>
            <Input id="ctaText" value={formData.ctaText} onChange={(e) => handleChange('ctaText', e.target.value)} placeholder="Enter CTA label" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaLink">CTA Link</Label>
            <Input id="ctaLink" value={formData.ctaLink} onChange={(e) => handleChange('ctaLink', e.target.value)} placeholder="Enter CTA URL" />
          </div>

          <DrawerFooter className="px-0 grid grid-cols-2">
            <Button type="submit" className="w-full">Save Changes</Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="w-full">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
