'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import type { FAQData } from './View';

interface HearingAidsFAQAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: FAQData;
  onSave: (data: FAQData) => void;
}

export function HearingAidsFAQAdminForm({
  isOpen,
  onClose,
  data,
  onSave,
}: HearingAidsFAQAdminFormProps) {
  const [formData, setFormData] = useState<FAQData>(data);

  const updateFAQ = (index: number, key: 'title' | 'description', value: string) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [key]: value };
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
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
          <DrawerTitle>Edit FAQ Section</DrawerTitle>
          <DrawerDescription>Update questions and CTA button</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit}
          className="px-4 flex-1 flex flex-col space-y-6 overflow-auto"
          style={{ height: 'calc(100% - 150px)' }}
        >
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            {formData.faqs.map((faq, idx) => (
              <div key={idx} className="border rounded p-4 space-y-3">
                <Label>Question {idx + 1}</Label>
                <Input
                  value={faq.title}
                  onChange={(e) => updateFAQ(idx, 'title', e.target.value)}
                  placeholder="Enter question"
                />
                <Textarea
                  value={faq.description}
                  onChange={(e) => updateFAQ(idx, 'description', e.target.value)}
                  placeholder="Enter answer"
                  rows={3}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CTA Label</Label>
              <Input
                value={formData.cta.label}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    cta: { ...prev.cta, label: e.target.value },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>CTA Link</Label>
              <Input
                value={formData.cta.link}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    cta: { ...prev.cta, link: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <DrawerFooter className="px-0 grid grid-cols-2">
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
