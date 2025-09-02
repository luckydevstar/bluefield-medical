"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import type { HearingTestsTestimonialData } from "./View";

interface HearingTestsTestominalAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: HearingTestsTestimonialData;
  onSave: (data: HearingTestsTestimonialData) => void;
}

export function HearingTestsTestominalAdminForm({
  isOpen,
  onClose,
  data,
  onSave,
}: HearingTestsTestominalAdminFormProps) {
  const [formData, setFormData] = useState<HearingTestsTestimonialData>(data);

  const handleChange = <K extends keyof HearingTestsTestimonialData>(key: K, value: HearingTestsTestimonialData[K]) => {
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
          <DrawerTitle>Edit Testimonial</DrawerTitle>
          <DrawerDescription>Update testimonial content and author</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit}
          className="px-4 flex-1 flex flex-col space-y-6 overflow-auto"
          style={{ height: "calc(100% - 150px)" }}
        >
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Testimonial title"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Testimonial content"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Author name"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Author location"
              />
            </div>
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
