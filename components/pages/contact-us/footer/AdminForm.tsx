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
import { UploadDropzone } from '@/src/utils/uploadthing'; // adjust path if needed
import type { FooterData } from './View';

interface ContactUsFooterAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: FooterData;
  onSave: (data: FooterData) => void;
}

export function ContactUsFooterAdminForm({ isOpen, onClose, data, onSave }: ContactUsFooterAdminFormProps) {
  const [formData, setFormData] = useState<FooterData>(data);

  const handleUpdateArray = <T,>(
    key: keyof FooterData,
    index: number,
    field: keyof T,
    value: string
  ) => {
    const updated = [...(formData[key] as T[])];
    (updated[index][field] as unknown as string) = value;
    setFormData({ ...formData, [key]: updated });
  };

  const handleAddItem = (key: keyof FooterData, item: any) => {
    setFormData({ ...formData, [key]: [...(formData[key] as any[]), item] });
  };

  const handleRemoveItem = (key: keyof FooterData, index: number) => {
    const updated = [...(formData[key] as any[])];
    updated.splice(index, 1);
    setFormData({ ...formData, [key]: updated });
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
          <DrawerTitle>Edit Footer</DrawerTitle>
          <DrawerDescription>Edit logo, links, and contact info</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit}
          className="px-4 flex-1 flex flex-col space-y-6 overflow-auto"
          style={{ height: 'calc(100% - 150px)' }}
        >
          {/* Logo */}
          <div className="space-y-2">
            <Label>Logo</Label>
            {formData.logo?.url && (
              <div className="mb-2">
                <img src={formData.logo.url} alt="logo" className="w-40" />
              </div>
            )}
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  const { key, url } = res[0];
                  setFormData({ ...formData, logo: { key, url } });
                }
              }}
              onUploadError={(err) => {
                console.error('Upload error:', err.message);
                alert('Logo upload failed');
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Company Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Company Address"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <Label>Social Links</Label>
            {formData.social.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                <Input
                  placeholder="Twitter / GitHub / LinkedIn"
                  value={item.name}
                  onChange={(e) =>
                    handleUpdateArray<typeof item>('social', index, 'name', e.target.value)
                  }
                />
                <Input
                  placeholder="URL"
                  value={item.url}
                  onChange={(e) =>
                    handleUpdateArray<typeof item>('social', index, 'url', e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveItem('social', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => handleAddItem('social', { name: 'Twitter', url: '' })}
            >
              Add Social
            </Button>
          </div>

          

          {/* Resources */}
          <div className="space-y-2">
            <Label>Resources</Label>
            {formData.resources.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                <Input
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) =>
                    handleUpdateArray<typeof item>('resources', index, 'name', e.target.value)
                  }
                />
                <Input
                  placeholder="URL"
                  value={item.url}
                  onChange={(e) =>
                    handleUpdateArray<typeof item>('resources', index, 'url', e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveItem('resources', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => handleAddItem('resources', { name: '', url: '' })}
            >
              Add Resource
            </Button>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label>Company</Label>
            {formData.company.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                <Input
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) =>
                    handleUpdateArray<typeof item>('company', index, 'name', e.target.value)
                  }
                />
                <Input
                  placeholder="URL"
                  value={item.url}
                  onChange={(e) =>
                    handleUpdateArray<typeof item>('company', index, 'url', e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveItem('company', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => handleAddItem('company', { name: '', url: '' })}
            >
              Add Company Link
            </Button>
          </div>

          {/* Save / Cancel */}
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
