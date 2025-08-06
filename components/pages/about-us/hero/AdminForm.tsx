'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { UploadDropzone } from '@/src/utils/uploadthing'; // Adjust path if needed
import type { HeroData } from './View';

interface AboutUsHeroAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeroData;
  onSave: (data: HeroData) => void;
}

export function AboutUsHeroAdminForm({ isOpen, onClose, data, onSave }: AboutUsHeroAdminFormProps) {
  const [formData, setFormData] = useState<HeroData>(data);

  // Handle changes in fields
  const handleChange = (field: keyof HeroData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Edit About Us Hero Section</DrawerTitle>
          <DrawerDescription>Update the content for the About Us hero section.</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          {/* Title Field */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>

          {/* Image Field */}
          <div className="space-y-2">
            <Label>Image</Label>
            {formData.image?.url && (
              <div className="mb-2">
                <img src={formData.image.url} alt="Current" className="w-full max-w-md object-contain rounded-md" />
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
                alert('Upload failed');
              }}
            />
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
