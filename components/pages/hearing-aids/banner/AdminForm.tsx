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
import type { HearingAidsBannerData } from './View';
import { Textarea } from '@/components/ui/textarea';

interface HearingAidsBannerAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingAidsBannerData;
  onSave: (data: HearingAidsBannerData) => void;
}

export function HearingAidsBannerAdminForm({
  isOpen,
  onClose,
  data,
  onSave,
}: HearingAidsBannerAdminFormProps) {
  const [formData, setFormData] = useState<HearingAidsBannerData>(data);

  const handleChange = <K extends keyof HearingAidsBannerData>(
    field: K,
    value: HearingAidsBannerData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCTAChange = (field: keyof HearingAidsBannerData['cta'], value: string) => {
    setFormData(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }));
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
          <DrawerTitle>Edit Banner Section</DrawerTitle>
          <DrawerDescription>Update the copy and CTA for the banner</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Banner title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Banner description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CTA Label</Label>
              <Input
                value={formData.cta.label}
                onChange={(e) => handleCTAChange('label', e.target.value)}
                placeholder="e.g. Get started"
              />
            </div>
            <div className="space-y-2">
              <Label>CTA Link</Label>
              <Input
                value={formData.cta.link}
                onChange={(e) => handleCTAChange('link', e.target.value)}
                placeholder="/book-now"
              />
            </div>
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
