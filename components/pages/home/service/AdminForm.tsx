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
import { UploadDropzone } from '@/src/utils/uploadthing'; // Adjust path if needed
import type { ServicesData } from './View';

interface HomeServiceAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: ServicesData;
  onSave: (data: ServicesData) => void;
}

export function HomeServiceAdminForm({ isOpen, onClose, data, onSave }: HomeServiceAdminFormProps) {
  const [formData, setFormData] = useState<ServicesData>(data);

  const updateService = (index: number, key: keyof ServicesData['services'][0], value: any) => {
    const updated = [...formData.services];
    updated[index][key] = value;
    setFormData({ ...formData, services: updated });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { title: '', description: '', image: { key: '', url: '' } }]
    });
  };

  const removeService = (index: number) => {
    const updated = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updated });
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
          <DrawerTitle>Edit Services</DrawerTitle>
          <DrawerDescription>Manage service content and visuals</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          {formData.services.map((service, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">Service {index + 1}</h3>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeService(index)}>Remove</Button>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={service.title}
                  onChange={(e) => updateService(index, 'title', e.target.value)}
                  placeholder="Service title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(index, 'description', e.target.value)}
                  placeholder="Service description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Service Image</Label>
                {service.image?.url && (
                  <div className="mb-2">
                    <img src={service.image.url} alt={`service-${index}`} className="w-full max-w-md object-contain rounded-md" />
                  </div>
                )}
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const { key, url } = res[0];
                      updateService(index, 'image', { key, url });
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
            <Button type="button" onClick={addService}>Add Service</Button>
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
