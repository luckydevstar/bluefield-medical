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

interface FaqsFAQAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: FAQData;
  onSave: (data: FAQData) => void;
}

export function FaqsFAQAdminForm({ isOpen, onClose, data, onSave }: FaqsFAQAdminFormProps) {
  const [formData, setFormData] = useState<FAQData>(data);

  const updateSection = (index: number, key: keyof FAQData['faqs'][0], value: any) => {
    const updated = [...formData.faqs];
    updated[index][key] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const updateFAQItem = (sectionIndex: number, itemIndex: number, field: 'title' | 'description', value: string) => {
    const updatedSections = [...formData.faqs];
    updatedSections[sectionIndex].list[itemIndex][field] = value;
    setFormData({ ...formData, faqs: updatedSections });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { title: '', list: [] }]
    });
  };

  const removeSection = (index: number) => {
    const updated = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: updated });
  };

  const addFAQItem = (sectionIndex: number) => {
    const updatedSections = [...formData.faqs];
    updatedSections[sectionIndex].list.push({ title: '', description: '' });
    setFormData({ ...formData, faqs: updatedSections });
  };

  const removeFAQItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...formData.faqs];
    updatedSections[sectionIndex].list = updatedSections[sectionIndex].list.filter((_, i) => i !== itemIndex);
    setFormData({ ...formData, faqs: updatedSections });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Edit FAQs</DrawerTitle>
          <DrawerDescription>Edit global title and categorized questions</DrawerDescription>
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
              placeholder="e.g. Frequently Asked Questions"
            />
          </div>

          {formData.faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border rounded-md p-4 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">Section {sectionIndex + 1}</h3>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeSection(sectionIndex)}>
                  Remove Section
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                  placeholder="e.g. Accessibility, Services, Billing"
                />
              </div>

              {section.list.map((faq, itemIndex) => (
                <div key={itemIndex} className="border p-4 rounded-md bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">FAQ {itemIndex + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFAQItem(sectionIndex, itemIndex)}
                    >
                      Remove FAQ
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={faq.title}
                      onChange={(e) => updateFAQItem(sectionIndex, itemIndex, 'title', e.target.value)}
                      placeholder="Enter question"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.description}
                      onChange={(e) => updateFAQItem(sectionIndex, itemIndex, 'description', e.target.value)}
                      placeholder="Enter answer"
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              <Button type="button" onClick={() => addFAQItem(sectionIndex)}>
                Add FAQ
              </Button>
            </div>
          ))}

          <div>
            <Button type="button" onClick={addSection}>Add Section</Button>
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
