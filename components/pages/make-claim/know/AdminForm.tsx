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

import type { KnowData } from "./View";

export function HearingTestsKnowAdminForm({
  isOpen,
  onClose,
  data,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: KnowData;
  onSave: (data: KnowData) => void;
}) {
  const [formData, setFormData] = useState<KnowData>(data);

  const handleChange = (key: keyof KnowData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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
          <DrawerTitle>Edit Know Section</DrawerTitle>
          <DrawerDescription>Update the title and description content.</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
          </div>

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
