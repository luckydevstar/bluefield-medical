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

interface HomeFAQAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: FAQData;
  onSave: (data: FAQData) => void;
}

export function HomeFAQAdminForm({ isOpen, onClose, data, onSave }: HomeFAQAdminFormProps) {
  const [formData, setFormData] = useState<FAQData>(data);

  const updateFAQ = (index: number, key: keyof FAQData['faqs'][0], value: any) => {
    const updated = [...formData.faqs];
    updated[index][key] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { title: '', description: '' }]
    });
  };

  const removeFAQ = (index: number) => {
    const updated = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Edit FAQ Section</DrawerTitle>
          <DrawerDescription>Manage title, questions, and CTA</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>

          {formData.faqs.map((faq, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">FAQ {index + 1}</h3>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeFAQ(index)}>Remove</Button>
              </div>

              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={faq.title}
                  onChange={(e) => updateFAQ(index, 'title', e.target.value)}
                  placeholder="Enter question title"
                />
              </div>

              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  value={faq.description}
                  onChange={(e) => updateFAQ(index, 'description', e.target.value)}
                  rows={3}
                  placeholder="Enter answer description"
                />
              </div>
            </div>
          ))}

          <div>
            <Button type="button" onClick={addFAQ}>Add FAQ</Button>
          </div>

          <div className="space-y-2">
            <Label>CTA Label</Label>
            <Input
              value={formData.cta.label}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, label: e.target.value } })}
              placeholder="e.g. READ MORE FAQ"
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input
              value={formData.cta.link}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, link: e.target.value } })}
              placeholder="/faqs or external URL"
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
