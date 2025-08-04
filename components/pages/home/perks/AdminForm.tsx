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
import { UploadDropzone } from '@/src/utils/uploadthing'; // Adjust if needed
import type { PerksData } from './View';

interface HomePerksAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: PerksData;
  onSave: (data: PerksData) => void;
}

export function HomePerksAdminForm({ isOpen, onClose, data, onSave }: HomePerksAdminFormProps) {
  const [formData, setFormData] = useState<PerksData>(data);

  const updatePerk = (index: number, key: keyof PerksData['perks'][0], value: any) => {
    const updated = [...formData.perks];
    updated[index][key] = value;
    setFormData({ ...formData, perks: updated });
  };

  const addPerk = () => {
    setFormData({
      ...formData,
      perks: [...formData.perks, { title: '', icon: { key: '', url: '' } }]
    });
  };

  const removePerk = (index: number) => {
    const updated = formData.perks.filter((_, i) => i !== index);
    setFormData({ ...formData, perks: updated });
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
          <DrawerTitle>Edit Perks</DrawerTitle>
          <DrawerDescription>Add or edit perk icons and titles</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          {formData.perks.map((perk, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">Perk {index + 1}</h3>
                <Button type="button" variant="destructive" size="sm" onClick={() => removePerk(index)}>Remove</Button>
              </div>

              <div className="space-y-2">
                <Label>Perk Title</Label>
                <Input
                  value={perk.title}
                  onChange={(e) => updatePerk(index, 'title', e.target.value)}
                  placeholder="Enter perk title"
                />
              </div>

              <div className="space-y-2">
                <Label>Perk Icon</Label>
                {perk.icon?.url && (
                  <div className="mb-2">
                    <img src={perk.icon.url} alt={`perk-${index}`} className="w-24 h-24 object-contain rounded-md" />
                  </div>
                )}
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const { key, url } = res[0];
                      updatePerk(index, 'icon', { key, url });
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
            <Button type="button" onClick={addPerk}>Add Perk</Button>
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
