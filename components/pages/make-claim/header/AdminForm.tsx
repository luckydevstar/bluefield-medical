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
import { UploadDropzone } from '@/src/utils/uploadthing'; // adjust this path if needed
import { Textarea } from '@/components/ui/textarea';
import type { HeaderData } from './View';

interface HearingTestsHeaderAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeaderData;
  onSave: (data: HeaderData) => void;
}

export function HearingTestsHeaderAdminForm({ isOpen, onClose, data, onSave }: HearingTestsHeaderAdminFormProps) {
  const [formData, setFormData] = useState<HeaderData>(data);

  const handleChange = (field: keyof HeaderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNavLink = (index: number, key: 'name' | 'url', value: string) => {
    const updatedLinks = [...formData.nav_links];
    updatedLinks[index][key] = value;
    handleChange('nav_links', updatedLinks);
  };

  const addNavLink = () => {
    handleChange('nav_links', [...formData.nav_links, { name: '', url: '' }]);
  };

  const removeNavLink = (index: number) => {
    const updatedLinks = formData.nav_links.filter((_, i) => i !== index);
    handleChange('nav_links', updatedLinks);
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
          <DrawerTitle>Edit Header</DrawerTitle>
          <DrawerDescription>Update logo, nav links, and CTA button</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-6 overflow-auto" style={{ height: 'calc(100% - 50px)' }}>
            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo</Label>
              {formData.logo?.url && (
                <div className="mb-2">
                  <img src={formData.logo.url} alt="logo preview" className="w-[160px] rounded-md" />
                </div>
              )}
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    const { key, url } = res[0];
                    handleChange('logo', { key, url });
                  }
                }}
                onUploadError={(err) => {
                  console.error('Upload error:', err.message);
                  alert('Logo upload failed');
                }}
              />
            </div>

            {/* Nav Links */}
            <div className="space-y-2">
              <Label>Navigation Links</Label>
              {formData.nav_links.map((link, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 items-end">
                  <Input
                    placeholder="Name"
                    value={link.name}
                    onChange={(e) => updateNavLink(index, 'name', e.target.value)}
                    className="col-span-2"
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateNavLink(index, 'url', e.target.value)}
                    className="col-span-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeNavLink(index)}
                    className="col-span-1"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addNavLink}>Add Link</Button>
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Label</Label>
                <Input
                  value={formData.cta.label}
                  onChange={(e) => handleChange('cta', { ...formData.cta, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CTA URL</Label>
                <Input
                  value={formData.cta.url}
                  onChange={(e) => handleChange('cta', { ...formData.cta, url: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DrawerFooter className="px-0 grid grid-cols-2">
            <Button type="submit" className="w-full">Save</Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="w-full">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
