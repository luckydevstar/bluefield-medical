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
import { HearingAidsTestimonialData } from './View';

interface HearingAidsTestominalAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingAidsTestimonialData;
  onSave: (data: HearingAidsTestimonialData) => void;
}

export function HearingAidsTestominalAdminForm({ isOpen, onClose, data, onSave }: HearingAidsTestominalAdminFormProps) {
  const [formData, setFormData] = useState<HearingAidsTestimonialData>(data);

  const handleChange = (field: keyof HearingAidsTestimonialData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <DrawerTitle>Edit Testimonial Section</DrawerTitle>
          <DrawerDescription>Update testimonial content and attribution</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter section title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Testimonial</Label>
            <Input
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Enter testimonial content"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Customer Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter location or attribution"
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
