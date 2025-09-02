'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { HearingAidsHeroData } from './View';

interface HeroAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingAidsHeroData;
  onSave: (data: HearingAidsHeroData) => void;
}

export function HearingAidsHeroAdminForm({
  isOpen,
  onClose,
  data,
  onSave,
}: HeroAdminFormProps) {
  const [formData, setFormData] = useState<HearingAidsHeroData>(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof HearingAidsHeroData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Edit Hero Section</DrawerTitle>
          <DrawerDescription>Update the title and background image</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
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
            <Label>Background Image</Label>
            {formData.image?.url && (
              <div className="mb-2">
                <img
                  src={formData.image.url}
                  alt="Hero preview"
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

          <DrawerFooter className="px-0 grid grid-cols-2">
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
            <DrawerClose asChild className="w-full">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
