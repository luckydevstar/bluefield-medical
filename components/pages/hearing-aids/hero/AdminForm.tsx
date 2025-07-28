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
import { HearingAidsHeroData } from './View';

interface HeroAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingAidsHeroData;
  onSave: (data: HearingAidsHeroData) => void;
}

export function HearingAidsHeroAdminForm({ isOpen, onClose, data, onSave }: HeroAdminFormProps) {
  const [formData, setFormData] = useState<HearingAidsHeroData>(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof HearingAidsHeroData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Edit Hero Section</DrawerTitle>
          <DrawerDescription>
            Update the content for your hero section
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-6 overflow-auto" style={{ height: 'calc(100% - 50px)' }}>
            
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
    </Drawer >
  );
}