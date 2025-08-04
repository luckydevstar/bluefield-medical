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
import { UploadDropzone } from "@/src/utils/uploadthing";
import type { HearingLossTrustData } from "./View";

interface HearingLossTrustAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingLossTrustData;
  onSave: (data: HearingLossTrustData) => void;
}

export function HearingLossTrustAdminForm({ isOpen, onClose, data, onSave }: HearingLossTrustAdminFormProps) {
  const [formData, setFormData] = useState<HearingLossTrustData>(data);

  const updateTrust = (index: number, key: keyof HearingLossTrustData["trusts"][0], value: any) => {
    const updated = [...formData.trusts];
    updated[index][key] = value;
    setFormData({ ...formData, trusts: updated });
  };

  const addTrust = () => {
    setFormData({
      ...formData,
      trusts: [...formData.trusts, { title: "", description: "" }]
    });
  };

  const removeTrust = (index: number) => {
    const updated = formData.trusts.filter((_, i) => i !== index);
    setFormData({ ...formData, trusts: updated });
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
          <DrawerTitle>Edit Hearing Loss Trust Section</DrawerTitle>
          <DrawerDescription>Update title, subtitle, and trust descriptions</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Section title"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Section subtitle"
            />
          </div>

          {formData.trusts.map((item, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">Trust Item {index + 1}</h3>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeTrust(index)}>Remove</Button>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateTrust(index, 'title', e.target.value)}
                  placeholder="Trust title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateTrust(index, 'description', e.target.value)}
                  placeholder="Trust description"
                />
              </div>
            </div>
          ))}

          <Button type="button" onClick={addTrust}>Add Trust Item</Button>

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
