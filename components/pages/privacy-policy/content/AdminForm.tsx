'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import type { PrivacyPolicyContentViewData } from './View'; // Adjust path as necessary

interface PrivacyPolicyContentAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrivacyPolicyContentViewData;
  onSave: (data: PrivacyPolicyContentViewData) => void;
}

export function PrivacyPolicyContentAdminForm({ isOpen, onClose, data, onSave }: PrivacyPolicyContentAdminFormProps) {
  const [formData, setFormData] = useState<PrivacyPolicyContentViewData>(data);

  // Handle changes in fields
  const handleChange = (field: keyof PrivacyPolicyContentViewData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="mx-auto h-screen max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Edit Privacy Policy Content</DrawerTitle>
          <DrawerDescription>Update the content for the Privacy Policy section.</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          {/* Company Info Field */}
          <div className="space-y-2">
            <Label>Company Info</Label>
            <Input
              value={formData.company_info}
              onChange={(e) => handleChange('company_info', e.target.value)}
              placeholder="Enter company information"
            />
          </div>

          {/* Country Info Field */}
          <div className="space-y-2">
            <Label>Country Info</Label>
            <Input
              value={formData.country_info}
              onChange={(e) => handleChange('country_info', e.target.value)}
              placeholder="Enter country information"
            />
          </div>

          {/* Website Info Field */}
          <div className="space-y-2">
            <Label>Website Info URL</Label>
            <Input
              value={formData.website_info.url}
              onChange={(e) => handleChange('website_info', { ...formData.website_info, url: e.target.value })}
              placeholder="Enter website URL"
            />
            <Label>Website Info Title</Label>
            <Input
              value={formData.website_info.title}
              onChange={(e) => handleChange('website_info', { ...formData.website_info, title: e.target.value })}
              placeholder="Enter website title"
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={formData.by_phone_number}
              onChange={(e) => handleChange('by_phone_number', e.target.value)}
              placeholder="Enter phone number"
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
