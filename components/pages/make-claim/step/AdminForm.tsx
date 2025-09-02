'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import type { StepData } from './View';

interface StepAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: StepData;
  onSave: (data: StepData) => void;
}

export function HearingTestsStepAdminForm({ isOpen, onClose, data, onSave }: StepAdminFormProps) {
  const [formData, setFormData] = useState<StepData>(data);

  const updateBrief = (index: number, value: string) => {
    const updated = [...formData.briefs];
    updated[index] = value;
    setFormData({ ...formData, briefs: updated });
  };

  const addBrief = () => {
    setFormData({ ...formData, briefs: [...formData.briefs, ''] });
  };

  const removeBrief = (index: number) => {
    const updated = formData.briefs.filter((_, i) => i !== index);
    setFormData({ ...formData, briefs: updated });
  };

  const updateStep = (index: number, key: keyof StepData['steps'][0], value: string) => {
    const updated = [...formData.steps];
    updated[index][key] = value;
    setFormData({ ...formData, steps: updated });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { title: '', description: '' }],
    });
  };

  const removeStep = (index: number) => {
    const updated = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: updated });
  };

  const handleChange = (field: keyof StepData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCTAChange = (key: keyof StepData['cta'], value: string) => {
    setFormData(prev => ({
      ...prev,
      cta: { ...prev.cta, [key]: value },
    }));
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
          <DrawerTitle>Edit Hearing Test Steps</DrawerTitle>
          <DrawerDescription>Update titles, briefs, and step descriptions</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea value={formData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} rows={2} />
          </div>

          <div className="space-y-4">
            <Label>Briefs</Label>
            {formData.briefs.map((brief, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input value={brief} onChange={(e) => updateBrief(idx, e.target.value)} className="flex-1" />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeBrief(idx)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={addBrief}>Add Brief</Button>
          </div>

          <div className="space-y-4">
            <Label>Steps</Label>
            {formData.steps.map((step, idx) => (
              <div key={idx} className="p-4 border rounded-md space-y-2 bg-slate-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold">Step {idx + 1}</h3>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeStep(idx)}>Remove</Button>
                </div>
                <Input
                  placeholder="Step title"
                  value={step.title}
                  onChange={(e) => updateStep(idx, 'title', e.target.value)}
                />
                <Textarea
                  placeholder="Step description"
                  value={step.description}
                  onChange={(e) => updateStep(idx, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            ))}
            <Button type="button" onClick={addStep}>Add Step</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CTA Label</Label>
              <Input value={formData.cta.label} onChange={(e) => handleCTAChange('label', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CTA Link</Label>
              <Input value={formData.cta.link} onChange={(e) => handleCTAChange('link', e.target.value)} />
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