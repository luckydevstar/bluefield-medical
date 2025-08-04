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
import { UploadDropzone } from '@/src/utils/uploadthing'; // adjust if needed
import type { TestimonialsData } from './View';

interface HomeTestominalAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: TestimonialsData;
  onSave: (data: TestimonialsData) => void;
}

export function HomeTestominalAdminForm({ isOpen, onClose, data, onSave }: HomeTestominalAdminFormProps) {
  const [formData, setFormData] = useState<TestimonialsData>(data);

  const updateItem = (index: number, key: keyof TestimonialsData['testominals'][0], value: any) => {
    const updated = [...formData.testominals];
    updated[index][key] = value;
    setFormData({ ...formData, testominals: updated });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      testominals: [
        ...formData.testominals,
        {
          content: '',
          name: '',
          location: '',
          source: '',
          avatar: { key: '', url: '' }
        }
      ]
    });
  };

  const removeItem = (index: number) => {
    const updated = formData.testominals.filter((_, i) => i !== index);
    setFormData({ ...formData, testominals: updated });
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
          <DrawerTitle>Edit Testimonials</DrawerTitle>
          <DrawerDescription>Edit title and manage testimonial items</DrawerDescription>
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

          {formData.testominals.map((item, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">Testimonial {index + 1}</h3>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(index)}>
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={item.content}
                  onChange={(e) => updateItem(index, 'content', e.target.value)}
                  placeholder="Testimonial text"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    placeholder="Client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={item.location}
                    onChange={(e) => updateItem(index, 'location', e.target.value)}
                    placeholder="Client location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Source</Label>
                <Input
                  value={item.source}
                  onChange={(e) => updateItem(index, 'source', e.target.value)}
                  placeholder="Review source (e.g., Google)"
                />
              </div>

              <div className="space-y-2">
                <Label>Avatar</Label>
                {item.avatar?.url && (
                  <div className="mb-2">
                    <img src={item.avatar.url} alt={`avatar-${index}`} className="w-16 h-16 rounded-full" />
                  </div>
                )}
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const { key, url } = res[0];
                      updateItem(index, 'avatar', { key, url });
                    }
                  }}
                  onUploadError={(err) => {
                    console.error('Upload error:', err.message);
                    alert('Avatar upload failed');
                  }}
                />
              </div>
            </div>
          ))}

          <div>
            <Button type="button" onClick={addItem}>Add Testimonial</Button>
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
