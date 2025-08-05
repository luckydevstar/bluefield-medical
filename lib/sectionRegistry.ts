import {
  HomeFAQAdminForm, HomeFAQView,
  HomeFooterAdminForm, HomeFooterView,
  HomeHeaderAdminForm, HomeHeaderView,
  HomeHeroAdminForm, HomeHeroView,
  HomePerksAdminForm, HomePerksView,
  HomeServiceAdminForm, HomeServiceView,
  HomeStepsAdminForm, HomeStepsView,
  HomeTestominalAdminForm, HomeTestominalView
} from "@/components/pages/home";

import {
  HearingAidsBannerAdminForm,HearingAidsBannerView,
  HearingAidsDiscoverAdminForm,HearingAidsDiscoverView,
  HearingAidsFAQAdminForm,HearingAidsFAQView,
  HearingAidsFooterAdminForm,HearingAidsFooterView,
  HearingAidsHeaderAdminForm,HearingAidsHeaderView,
  HearingAidsHeroAdminForm,HearingAidsHeroView,
  HearingAidsShowcaseAdminForm,HearingAidsShowcaseView,
  HearingAidsTestominalAdminForm,HearingAidsTestominalView
} from "@/components/pages/hearing-aids";

import { 
  HearingLossBannerAdminForm, HearingLossBannerView, 
  HearingLossCTAAdminForm, HearingLossCTAView, 
  HearingLossFAQAdminForm, HearingLossFAQView, 
  HearingLossFooterAdminForm, HearingLossFooterView, 
  HearingLossHeaderAdminForm, HearingLossHeaderView, 
  HearingLossHeroAdminForm, HearingLossHeroView, 
  HearingLossServiceAdminForm, HearingLossServiceView, 
  HearingLossTestominalAdminForm, HearingLossTestominalView, 
  HearingLossTrustAdminForm, HearingLossTrustView 
} from "@/components/pages/hearing-loss";

import { 
  HearingTestsBannerAdminForm, HearingTestsBannerView, 
  HearingTestsFAQView, HearingTestsFooterAdminForm, 
  HearingTestsFooterView, HearingTestsHeaderAdminForm, 
  HearingTestsHeaderView, HearingTestsHeroAdminForm, 
  HearingTestsHeroView, HearingTestsKnowAdminForm, 
  HearingTestsKnowView, HearingTestsServiceAdminForm, 
  HearingTestsServiceView, HearingTestsFAQAdminForm,
  HearingTestsStepAdminForm, HearingTestsStepView, 
  HearingTestsTestominalAdminForm, HearingTestsTestominalView 
} from "@/components/pages/hearing-tests";

import {
  FaqsFAQAdminForm, FaqsFAQView, 
  FaqsFooterAdminForm, FaqsFooterView, 
  FaqsHeaderAdminForm, FaqsHeaderView, 
  FaqsHeroAdminForm, FaqsHeroView 
} from "@/components/pages/faqs";

import { 
  PrivacyPolicyFooterAdminForm, PrivacyPolicyFooterView, 
  PrivacyPolicyHeaderAdminForm, PrivacyPolicyHeaderView, 
  PrivacyPolicyHeroAdminForm, PrivacyPolicyHeroView 
} from "@/components/pages/privacy-policy";

import { 
  AboutUsAboutAdminForm, AboutUsAboutView, 
  AboutUsFooterAdminForm, AboutUsFooterView, 
  AboutUsHeaderAdminForm, AboutUsHeaderView, 
  AboutUsHeroAdminForm, AboutUsHeroView 
} from "@/components/pages/about-us";

import { 
  BookNowFooterAdminForm, BookNowFooterView, 
  BookNowHeaderAdminForm, BookNowHeaderView, 
  BookNowHeroAdminForm, BookNowHeroView 
} from "@/components/pages/book-now";

import { 
  ContactUsFooterAdminForm, ContactUsFooterView, 
  ContactUsHeaderAdminForm, ContactUsHeaderView, 
  ContactUsHeroAdminForm, ContactUsHeroView 
} from "@/components/pages/contact-us";

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
      View: HomeHeaderView,
      AdminForm: HomeHeaderAdminForm
    },
    hero: {
      View: HomeHeroView,
      AdminForm: HomeHeroAdminForm,
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
      View: HomeFooterView,
      AdminForm: HomeFooterAdminForm
    }
  },
  "hearing-aids": {
    header: {
      View: HearingAidsHeaderView,
      AdminForm: HearingAidsHeaderAdminForm
    },
    hero: {
      View: HearingAidsHeroView,
      AdminForm: HearingAidsHeroAdminForm
    },
    banner: {
      View: HearingAidsBannerView,
      AdminForm: HearingAidsBannerAdminForm
    },
    showcase: {
      View: HearingAidsShowcaseView,
      AdminForm: HearingAidsShowcaseAdminForm
    },
    testominal: {
      View: HearingAidsTestominalView,
      AdminForm: HearingAidsTestominalAdminForm
    },
    discover: {
      View: HearingAidsDiscoverView,
      AdminForm: HearingAidsDiscoverAdminForm
    },
    faq: {
      View: HearingAidsFAQView,
      AdminForm: HearingAidsFAQAdminForm
    },
    footer: {
      View: HearingAidsFooterView,
      AdminForm: HearingAidsFooterAdminForm
    }
  },
  "hearing-loss": {
    header: {
      View: HearingLossHeaderView,
      AdminForm: HearingLossHeaderAdminForm
    },
    hero: {
      View: HearingLossHeroView,
      AdminForm: HearingLossHeroAdminForm
    },
    banner: {
      View: HearingLossBannerView,
      AdminForm: HearingLossBannerAdminForm
    },
    trust: {
      View: HearingLossTrustView,
      AdminForm: HearingLossTrustAdminForm
    },
    cta: {
      View: HearingLossCTAView,
      AdminForm: HearingLossCTAAdminForm
    },
    service: {
      View: HearingLossServiceView,
      AdminForm: HearingLossServiceAdminForm
    },
    testominal: {
      View: HearingLossTestominalView,
      AdminForm: HearingLossTestominalAdminForm
    },
    faq: {
      View: HearingLossFAQView,
      AdminForm: HearingLossFAQAdminForm
    },
    footer: {
      View: HearingLossFooterView,
      AdminForm: HearingLossFooterAdminForm
    }
  },
  "hearing-tests": {
    header: {
      View: HearingTestsHeaderView,
      AdminForm: HearingTestsHeaderAdminForm
    },
    hero: {
      View: HearingTestsHeroView,
      AdminForm: HearingTestsHeroAdminForm
    },
    banner: {
      View: HearingTestsBannerView,
      AdminForm: HearingTestsBannerAdminForm
    },
    step: {
      View: HearingTestsStepView,
      AdminForm: HearingTestsStepAdminForm
    },
    know: {
      View: HearingTestsKnowView,
      AdminForm: HearingTestsKnowAdminForm
    },
    service: {
      View: HearingTestsServiceView,
      AdminForm: HearingTestsServiceAdminForm
    },
    testominal: {
      View: HearingTestsTestominalView,
      AdminForm: HearingTestsTestominalAdminForm
    },
    faq: {
      View: HearingTestsFAQView,
      AdminForm: HearingTestsFAQAdminForm
    },
    footer: {
      View: HearingTestsFooterView,
      AdminForm: HearingTestsFooterAdminForm
    }
  },
  faqs: {
    header: {
      View: FaqsHeaderView,
      AdminForm: FaqsHeaderAdminForm
    },
    hero: {
      View: FaqsHeroView,
      AdminForm: FaqsHeroAdminForm
    },
    faq: {
      View: FaqsFAQView,
      AdminForm: FaqsFAQAdminForm
    },
    footer: {
      View: FaqsFooterView,
      AdminForm: FaqsFooterAdminForm
    }
  },
  "privacy-policy": {
    header: {
      View: PrivacyPolicyHeaderView,
      AdminForm: PrivacyPolicyHeaderAdminForm
    },
    hero: {
      View: PrivacyPolicyHeroView,
      AdminForm: PrivacyPolicyHeroAdminForm
    },
    content: {
      View: PrivacyPolicyHeroView,
      AdminForm: PrivacyPolicyHeroAdminForm
    },
    footer: {
      View: PrivacyPolicyFooterView,
      AdminForm: PrivacyPolicyFooterAdminForm
    }
  },
  "about-us": {
    header: {
      View: AboutUsHeaderView,
      AdminForm: AboutUsHeaderAdminForm
    },
    hero: {
      View: AboutUsHeroView,
      AdminForm: AboutUsHeroAdminForm
    },
    about: {
      View: AboutUsAboutView,
      AdminForm: AboutUsAboutAdminForm
    },
    footer: {
      View: AboutUsFooterView,
      AdminForm: AboutUsFooterAdminForm
    }
  },
  "book-now": {
    header: {
      View: BookNowHeaderView,
      AdminForm: BookNowHeaderAdminForm
    },
    hero: {
      View: BookNowHeroView,
      AdminForm: BookNowHeroAdminForm
    },
    footer: {
      View: BookNowFooterView,
      AdminForm: BookNowFooterAdminForm
    }
  },
  "contact-us": {
    header: {
      View: ContactUsHeaderView,
      AdminForm: ContactUsHeaderAdminForm
    },
    hero: {
      View: ContactUsHeroView,
      AdminForm: ContactUsHeroAdminForm
    },
    footer: {
      View: ContactUsFooterView,
      AdminForm: ContactUsFooterAdminForm
    }
  }
};

export function getSectionComponent(page: string, section: string): SectionComponent | null {
  return sectionRegistry[page]?.[section] || null;
}