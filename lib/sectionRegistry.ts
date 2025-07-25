import { HeroView } from '@/components/pages/home/hero/View';
import { HeroAdminForm } from '@/components/pages/home/hero/AdminForm';
import { HeaderView } from '@/components/pages/home/header/View';
import { HeaderAdminForm } from '@/components/pages/home/header/AdminForm';
import { FooterView } from '@/components/pages/home/footer/View';
import { FooterAdminForm } from '@/components/pages/home/footer/AdminForm';

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
    header: {
      View: HeaderView,
      AdminForm: HeaderAdminForm
    },
    hero: {
      View: HeroView,
      AdminForm: HeroAdminForm,
    },
    footer: {
      View: FooterView,
      AdminForm: FooterAdminForm
    }
  },
};

export function getSectionComponent(page: string, section: string): SectionComponent | null {
  return sectionRegistry[page]?.[section] || null;
}