'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { HeroData } from './View';
import { UploadDropzone } from '@/src/utils/uploadthing'; // Adjust path if needed

interface BookNowAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeroData;
  onSave: (data: HeroData) => void;
}

export function BookNowHeroAdminForm({ isOpen, onClose, data, onSave }: BookNowAdminFormProps) {
  const [formData, setFormData] = useState<HeroData>(data);

  const handleChange = (field: keyof HeroData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <DrawerTitle>Edit Hero Section</DrawerTitle>
          <DrawerDescription>Update the content for your hero section</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-6 overflow-auto" style={{ height: 'calc(100% - 50px)' }}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Background Image</Label>
              {formData.image?.url && (
                <div className="mb-2">
                  <img src={formData.image.url} alt="Current" className="w-full rounded-md" />
                </div>
              )}
              <UploadDropzone
                endpoint="imageUploader" // Match your `uploadthing` config
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  placeholder="Button text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaLink">CTA Button Link</Label>
                <Input
                  id="ctaLink"
                  value={formData.ctaLink}
                  onChange={(e) => handleChange('ctaLink', e.target.value)}
                  placeholder="Button link"
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="px-0 grid grid-cols-2">
            <div className="col-span-1">
              <Button type="submit" className="w-full">Save Changes</Button>
            </div>
            <div className="col-span-1">
              <DrawerClose asChild className="w-full">
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
