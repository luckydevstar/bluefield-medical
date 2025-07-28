import { HeroView } from '@/components/pages/home/hero/View';
import { HeroAdminForm } from '@/components/pages/home/hero/AdminForm';
import { HeaderView } from '@/components/pages/home/header/View';
import { HeaderAdminForm } from '@/components/pages/home/header/AdminForm';
import { FooterView } from '@/components/pages/home/footer/View';
import { FooterAdminForm } from '@/components/pages/home/footer/AdminForm';
import { HomePerksView } from '@/components/pages/home/perks/View';
import { HomePerksAdminForm } from '@/components/pages/home/perks/AdminForm';
import { HomeStepsView } from '@/components/pages/home/step/View';
import { HomeStepsAdminForm } from '@/components/pages/home/step/AdminForm';
import { HomeServiceView } from '@/components/pages/home/service/View';
import { HomeServiceAdminForm } from '@/components/pages/home/service/AdminForm';
import { HomeTestominalView } from '@/components/pages/home/testominal/View';
import { HomeTestominalAdminForm } from '@/components/pages/home/testominal/AdminForm';
import { HomeFAQView } from '@/components/pages/home/faq/View';
import { HomeFAQAdminForm } from '@/components/pages/home/faq/AdminForm';

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
    step: {
      View: HomeStepsView,
      AdminForm: HomeStepsAdminForm,
    },
    perks: {
      View: HomePerksView,
      AdminForm: HomePerksAdminForm
    },
    service: {
      View: HomeServiceView,
      AdminForm: HomeServiceAdminForm
    },
    testominal: {
      View: HomeTestominalView,
      AdminForm: HomeTestominalAdminForm
    },
    faq: {
      View: HomeFAQView,
      AdminForm: HomeFAQAdminForm
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