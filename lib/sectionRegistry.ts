import { HeroView } from '@/components/pages/home/hero/View';
import { HeroAdminForm } from '@/components/pages/home/hero/AdminForm';

export interface SectionComponent {
  View: React.ComponentType<{ data: any }>;
  AdminForm: React.ComponentType<{
    isOpen: boolean;
    onClose: () => void;
    data: any;
    onSave: (data: any) => void;
  }>;
}

export const sectionRegistry: Record<string, Record<string, SectionComponent>> = {
  home: {
    hero: {
      View: HeroView,
      AdminForm: HeroAdminForm,
    },
  },
};

export function getSectionComponent(page: string, section: string): SectionComponent | null {
  return sectionRegistry[page]?.[section] || null;
}