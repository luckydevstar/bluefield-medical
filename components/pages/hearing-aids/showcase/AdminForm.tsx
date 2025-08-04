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
import { UploadDropzone } from '@/src/utils/uploadthing';
import type { HearingAidsShowcaseData } from './View';

interface HearingAidsShowcaseAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingAidsShowcaseData;
  onSave: (data: HearingAidsShowcaseData) => void;
}

export function HearingAidsShowcaseAdminForm({ isOpen, onClose, data, onSave }: HearingAidsShowcaseAdminFormProps) {
  const [formData, setFormData] = useState<HearingAidsShowcaseData>(data);

  const updateField = <K extends keyof HearingAidsShowcaseData>(field: K, value: HearingAidsShowcaseData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateShowcase = (index: number, key: keyof HearingAidsShowcaseData['showcases'][0], value: any) => {
    const updated = [...formData.showcases];
    updated[index][key] = value;
    setFormData({ ...formData, showcases: updated });
  };

  const addShowcase = () => {
    setFormData({
      ...formData,
      showcases: [...formData.showcases, { title: '', description: '', image: { key: '', url: '' } }]
    });
  };

  const removeShowcase = (index: number) => {
    const updated = formData.showcases.filter((_, i) => i !== index);
    setFormData({ ...formData, showcases: updated });
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
          <DrawerTitle>Edit Showcase Section</DrawerTitle>
          <DrawerDescription>Manage showcase content, CTA, and descriptions</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => updateField('title', e.target.value)} />
            </div>

            <div>
              <Label>Title Description</Label>
              <Input value={formData.titleDescription} onChange={(e) => updateField('titleDescription', e.target.value)} />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input value={formData.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} />
            </div>

            <div>
              <Label>Subtitle Description</Label>
              <Input value={formData.subtitleDescription} onChange={(e) => updateField('subtitleDescription', e.target.value)} />
            </div>

            <div>
              <Label>CTA Label</Label>
              <Input value={formData.cta.label} onChange={(e) => updateField('cta', { ...formData.cta, label: e.target.value })} />
            </div>

            <div>
              <Label>CTA Link</Label>
              <Input value={formData.cta.link} onChange={(e) => updateField('cta', { ...formData.cta, link: e.target.value })} />
            </div>
          </div>

          <div className="space-y-6">
            {formData.showcases.map((item, index) => (
              <div key={index} className="border rounded-md p-4 space-y-4 bg-slate-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold">Showcase {index + 1}</h3>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeShowcase(index)}>Remove</Button>
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateShowcase(index, 'title', e.target.value)}
                    placeholder="Enter title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateShowcase(index, 'description', e.target.value)}
                    placeholder="Enter description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image</Label>
                  {item.image?.url && (
                    <div className="mb-2">
                      <img
                        src={item.image.url}
                        alt={`showcase-${index}`}
                        className="w-full max-h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        const { key, url } = res[0];
                        updateShowcase(index, 'image', { key, url });
                      }
                    }}
                    onUploadError={(err) => {
                      console.error('Upload error:', err.message);
                      alert('Image upload failed');
                    }}
                  />
                </div>
              </div>
            ))}

            <Button type="button" onClick={addShowcase}>Add Showcase</Button>
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
