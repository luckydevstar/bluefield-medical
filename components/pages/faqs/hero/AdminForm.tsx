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
import { UploadDropzone } from '@/src/utils/uploadthing'; // Adjust path if needed
import { HeroData } from './View';

interface HeroAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeroData;
  onSave: (data: HeroData) => void;
}

export function FaqsHeroAdminForm({ isOpen, onClose, data, onSave }: HeroAdminFormProps) {
  const [formData, setFormData] = useState<HeroData>(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof HeroData, value: any) => {
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
                  alt="hero background preview"
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
            <div className="col-span-1">
              <Button type="submit" className='w-full'>Save Changes</Button>
            </div>
            <div className="col-span-1">
              <DrawerClose asChild className='w-full'>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
