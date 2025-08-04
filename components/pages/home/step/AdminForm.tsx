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
import { UploadDropzone } from '@/src/utils/uploadthing'; // adjust the path if needed
import type { ProcessStepsData } from './View';

interface HomeStepsAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProcessStepsData;
  onSave: (data: ProcessStepsData) => void;
}

export function HomeStepsAdminForm({ isOpen, onClose, data, onSave }: HomeStepsAdminFormProps) {
  const [formData, setFormData] = useState<ProcessStepsData>(data);

  const handleChange = (field: keyof ProcessStepsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateStep = (index: number, key: keyof ProcessStepsData['steps'][0], value: any) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index][key] = value;
    handleChange('steps', updatedSteps);
  };

  const addStep = () => {
    handleChange('steps', [
      ...formData.steps,
      { title: '', description: '', image: { key: '', url: '' } },
    ]);
  };

  const removeStep = (index: number) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    handleChange('steps', updatedSteps);
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
          <DrawerTitle>Edit Process Steps Section</DrawerTitle>
          <DrawerDescription>Update title and each step's content and image</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter section title"
            />
          </div>

          {formData.steps.map((step, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">Step {index + 1}</h3>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeStep(index)}>Remove</Button>
              </div>

              <div className="space-y-2">
                <Label>Step Title</Label>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  placeholder="Step title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  rows={3}
                  placeholder="Step description"
                />
              </div>

              <div className="space-y-2">
                <Label>Step Image</Label>
                {step.image?.url && (
                  <div className="mb-2">
                    <img src={step.image.url} alt={`step-${index}`} className="w-full max-w-sm rounded-md" />
                  </div>
                )}
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const { key, url } = res[0];
                      updateStep(index, 'image', { key, url });
                    }
                  }}
                  onUploadError={(err) => {
                    console.error('Upload error:', err.message);
                    alert('Upload failed');
                  }}
                />
              </div>
            </div>
          ))}

          <div>
            <Button type="button" onClick={addStep}>Add Step</Button>
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
