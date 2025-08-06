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
import { PrivacyPolicyMetadata } from './View'; // Adjust according to your actual file structure

interface PrivacyPolicyHeroAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrivacyPolicyMetadata;
  onSave: (data: PrivacyPolicyMetadata) => void;
}

export function PrivacyPolicyHeroAdminForm({ isOpen, onClose, data, onSave }: PrivacyPolicyHeroAdminFormProps) {
  const [formData, setFormData] = useState<PrivacyPolicyMetadata>(data);

  // Handle changes in the form fields
  const handleChange = (field: keyof PrivacyPolicyMetadata, value: any) => {
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
          <DrawerTitle>Edit Privacy Policy Hero Section</DrawerTitle>
          <DrawerDescription>Update the title and subtitle for the Privacy Policy section.</DrawerDescription>
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
