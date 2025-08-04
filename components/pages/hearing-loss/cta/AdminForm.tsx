"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { HearingLossCTAData } from "./View";

interface AdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingLossCTAData;
  onSave: (data: HearingLossCTAData) => void;
}

export function HearingLossCTAAdminForm({ isOpen, onClose, data, onSave }: AdminFormProps) {
  const [formData, setFormData] = useState<HearingLossCTAData>(data);

  const handleChange = (field: keyof HearingLossCTAData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <DrawerTitle>Edit CTA Section</DrawerTitle>
          <DrawerDescription>Update the button label and link</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label>Button Label</Label>
            <Input
              value={formData.label}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Enter button label"
            />
          </div>

          <div className="space-y-2">
            <Label>Button Link</Label>
            <Input
              value={formData.link}
              onChange={(e) => handleChange('link', e.target.value)}
              placeholder="Enter URL path"
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
