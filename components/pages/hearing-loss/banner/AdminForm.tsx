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
import type { HearingLossBannerData } from './View';

interface HearingLossBannerAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingLossBannerData;
  onSave: (data: HearingLossBannerData) => void;
}

export function HearingLossBannerAdminForm({ isOpen, onClose, data, onSave }: HearingLossBannerAdminFormProps) {
  const [formData, setFormData] = useState<HearingLossBannerData>(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof HearingLossBannerData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCTAChange = (key: keyof HearingLossBannerData['cta'], value: string) => {
    setFormData(prev => ({ ...prev, cta: { ...prev.cta, [key]: value } }));
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Edit Banner</DrawerTitle>
          <DrawerDescription>Update the title, description, and CTA</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter banner title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta-label">CTA Label</Label>
            <Input
              id="cta-label"
              value={formData.cta.label}
              onChange={(e) => handleCTAChange('label', e.target.value)}
              placeholder="Enter button label"
            />
            <Label htmlFor="cta-link">CTA Link</Label>
            <Input
              id="cta-link"
              value={formData.cta.link}
              onChange={(e) => handleCTAChange('link', e.target.value)}
              placeholder="Enter button link"
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
