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
import type { AboutData } from './View'; // Assuming the View has AboutData imported

interface AboutUsAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: AboutData;
  onSave: (data: AboutData) => void;
}

export function AboutUsAdminForm({ isOpen, onClose, data, onSave }: AboutUsAdminFormProps) {
  const [formData, setFormData] = useState<AboutData>(data);

  // Update fields dynamically
  const updateField = (key: keyof AboutData, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const updateService = (index: number, key: keyof AboutData['perk'], value: any) => {
    const updated = [...formData.perk.content];
    updated[index] = value;
    setFormData({ ...formData, perk: { ...formData.perk, content: updated } });
  };

  const updateTeamMember = (index: number, key: keyof AboutData['team']['members'][0], value: any) => {
    const updated = [...formData.team.members];
    updated[index][key] = value;
    setFormData({ ...formData, team: { ...formData.team, members: updated } });
  };

  const updateTeamLeader = (index: number, key: keyof AboutData['team']['leaders'][0], value: any) => {
    const updated = [...formData.team.leaders];
    updated[index][key] = value;
    setFormData({ ...formData, team: { ...formData.team, leaders: updated } });
  };

  const addService = () => {
    setFormData({
      ...formData,
      perk: { ...formData.perk, content: [...formData.perk.content, ''] },
    });
  };

  const removeService = (index: number) => {
    const updated = formData.perk.content.filter((_, i) => i !== index);
    setFormData({ ...formData, perk: { ...formData.perk, content: updated } });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team: {
        ...formData.team,
        members: [
          ...formData.team.members,
          { name: '', role: '', photo: { key: '', url: '' }, title: '', description: '' },
        ],
      },
    });
  };

  const removeTeamMember = (index: number) => {
    const updated = formData.team.members.filter((_, i) => i !== index);
    setFormData({ ...formData, team: { ...formData.team, members: updated } });
  };

  const addTeamLeader = () => {
    setFormData({
      ...formData,
      team: {
        ...formData.team,
        leaders: [
          ...formData.team.leaders,
          { name: '', role: '', photo: { key: '', url: '' }, title: '', description: '' },
        ],
      },
    });
  };

  const removeTeamLeader = (index: number) => {
    const updated = formData.team.leaders.filter((_, i) => i !== index);
    setFormData({ ...formData, team: { ...formData.team, leaders: updated } });
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
          <DrawerTitle>Edit About Us</DrawerTitle>
          <DrawerDescription>Manage the content for the About Us page</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 flex-1 flex flex-col space-y-6 overflow-auto" style={{ height: 'calc(100% - 150px)' }}>
          {/* Intro Section */}
          <div className="border rounded-md p-4 space-y-4 bg-slate-50">
            <h3 className="text-md font-semibold">Intro</h3>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.intro.title}
                onChange={(e) => updateField('intro', { ...formData.intro, title: e.target.value })}
                placeholder="Title"
              />
            </div>
            <div className="space-y-2">
              <Label>Paragraphs</Label>
              {formData.intro.paragraphs.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const updated = [...formData.intro.paragraphs];
                      updated[idx] = e.target.value;
                      updateField('intro', { ...formData.intro, paragraphs: updated });
                    }}
                    placeholder="Paragraph"
                    rows={3}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    const { key, url } = res[0];
                    updateField('intro', { ...formData.intro, photo: { key, url } });
                  }
                }}
                onUploadError={(err) => {
                  console.error('Upload error:', err.message);
                  alert('Upload failed');
                }}
              />
            </div>
          </div>

          {/* About Section */}
          <div className="border rounded-md p-4 space-y-4 bg-slate-50">
            <h3 className="text-md font-semibold">About</h3>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.about.title}
                onChange={(e) => updateField('about', { ...formData.about, title: e.target.value })}
                placeholder="Title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              {formData.about.content.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const updated = [...formData.about.content];
                      updated[idx] = e.target.value;
                      updateField('about', { ...formData.about, content: updated });
                    }}
                    placeholder="Content"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* What We Do Section */}
          <div className="border rounded-md p-4 space-y-4 bg-slate-50">
            <h3 className="text-md font-semibold">What We Do</h3>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.what_we_do.title}
                onChange={(e) => updateField('what_we_do', { ...formData.what_we_do, title: e.target.value })}
                placeholder="Title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              {formData.what_we_do.content.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const updated = [...formData.what_we_do.content];
                      updated[idx] = e.target.value;
                      updateField('what_we_do', { ...formData.what_we_do, content: updated });
                    }}
                    placeholder="Content"
                    rows={3}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    const { key, url } = res[0];
                    updateField('what_we_do', { ...formData.what_we_do, image: { key, url } });
                  }
                }}
                onUploadError={(err) => {
                  console.error('Upload error:', err.message);
                  alert('Upload failed');
                }}
              />
            </div>
          </div>

          {/* Perk Section */}
          <div className="border rounded-md p-4 space-y-4 bg-slate-50">
            <h3 className="text-md font-semibold">Perk</h3>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.perk.title}
                onChange={(e) => updateField('perk', { ...formData.perk, title: e.target.value })}
                placeholder="Title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              {formData.perk.content.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <Textarea
                    value={item}
                    onChange={(e) => updateService(idx, 'content', e.target.value)}
                    placeholder="Content"
                    rows={3}
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeService(idx)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addService}>
                Add Content
              </Button>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="border rounded-md p-4 space-y-4 bg-slate-50">
            <h3 className="text-md font-semibold">Team Members</h3>
            {formData.team.members.map((member, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-semibold">Team Member {idx + 1}</h4>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeTeamMember(idx)}>
                    Remove
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => updateTeamMember(idx, 'name', e.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={member.role}
                    onChange={(e) => updateTeamMember(idx, 'role', e.target.value)}
                    placeholder="Role"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={member.title}
                    onChange={(e) => updateTeamMember(idx, 'title', e.target.value)}
                    placeholder="Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={member.description}
                    onChange={(e) => updateTeamMember(idx, 'description', e.target.value)}
                    placeholder="Description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Photo</Label>
                  {member.photo?.url && (
                    <div className="mb-2">
                      <img src={member.photo.url} alt={member.name} className="w-full max-w-md object-contain rounded-md" />
                    </div>
                  )}
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        const { key, url } = res[0];
                        updateTeamMember(idx, 'photo', { key, url });
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
            <Button type="button" onClick={addTeamMember}>
              Add Team Member
            </Button>
          </div>

          {/* Team Leaders Section */}
          <div className="border rounded-md p-4 space-y-4 bg-slate-50">
            <h3 className="text-md font-semibold">Team Leaders</h3>
            {formData.team.leaders.map((leader, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-semibold">Team Leader {idx + 1}</h4>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeTeamLeader(idx)}>
                    Remove
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={leader.name}
                    onChange={(e) => updateTeamLeader(idx, 'name', e.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={leader.role}
                    onChange={(e) => updateTeamLeader(idx, 'role', e.target.value)}
                    placeholder="Role"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={leader.title}
                    onChange={(e) => updateTeamLeader(idx, 'title', e.target.value)}
                    placeholder="Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={leader.description}
                    onChange={(e) => updateTeamLeader(idx, 'description', e.target.value)}
                    placeholder="Description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Photo</Label>
                  {leader.photo?.url && (
                    <div className="mb-2">
                      <img src={leader.photo.url} alt={leader.name} className="w-full max-w-md object-contain rounded-md" />
                    </div>
                  )}
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        const { key, url } = res[0];
                        updateTeamLeader(idx, 'photo', { key, url });
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
            <Button type="button" onClick={addTeamLeader}>
              Add Team Leader
            </Button>
          </div>

          {/* Summary Section */}
          <div className="border rounded-md p-4 space-y-4 bg-slate-50">
            <h3 className="text-md font-semibold">Summary</h3>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.summary.title}
                onChange={(e) => updateField('summary', { ...formData.summary, title: e.target.value })}
                placeholder="Title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              {formData.summary.content.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const updated = [...formData.summary.content];
                      updated[idx] = e.target.value;
                      updateField('summary', { ...formData.summary, content: updated });
                    }}
                    placeholder="Content"
                    rows={3}
                  />
                </div>
              ))}
            </div>
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
