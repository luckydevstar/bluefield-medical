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
import { HeroData } from './View'; // Adjust according to your actual file structure

interface BookNowAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeroData;
  onSave: (data: HeroData) => void;
}

export function BookNowHeroAdminForm({ isOpen, onClose, data, onSave }: BookNowAdminFormProps) {
  const [formData, setFormData] = useState<HeroData>(data);

  // Function to handle the change of field values
  const handleChange = (field: keyof HeroData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Save the data when form is submitted
    onClose(); // Close the admin form
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Edit Book Now Hero Section</DrawerTitle>
          <DrawerDescription>{`Update the content for the "Book Now" section on the homepage.`}</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Enter subtitle"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Destination Email</Label>
            <Input
              value={formData.destination_email}
              onChange={(e) => handleChange('destination_email', e.target.value)}
              placeholder="Enter email"
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
