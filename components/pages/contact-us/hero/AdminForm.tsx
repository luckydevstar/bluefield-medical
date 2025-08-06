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
import { UploadDropzone } from '@/src/utils/uploadthing'; // Adjust path if needed
import { HeroData } from './View'; // Adjust according to your actual file structure

interface ContactUsHeroAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeroData;
  onSave: (data: HeroData) => void;
}

export function ContactUsHeroAdminForm({ isOpen, onClose, data, onSave }: ContactUsHeroAdminFormProps) {
  const [formData, setFormData] = useState<HeroData>(data);

  // Handle changes in the form fields
  const handleChange = (field: keyof HeroData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Save the data
    onClose(); // Close the admin form
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Edit Contact Us Hero Section</DrawerTitle>
          <DrawerDescription>Update the content for the "Contact Us" section.</DrawerDescription>
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

          {/* Subtitle Field */}
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Enter subtitle"
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image</Label>
            {formData.image?.url && (
              <div className="mb-2">
                <img src={formData.image.url} alt="Hero Image" className="w-full max-w-md object-contain rounded-md" />
              </div>
            )}
            <UploadDropzone
              endpoint="imageUploader" // Adjust based on your upload configuration
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

          {/* Destination Email Field */}
          <div className="space-y-2">
            <Label>Destination Email</Label>
            <Input
              value={formData.destination_email}
              onChange={(e) => handleChange('destination_email', e.target.value)}
              placeholder="Enter destination email"
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
