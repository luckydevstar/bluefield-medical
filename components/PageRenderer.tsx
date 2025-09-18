'use client';

import { SectionWrapper } from '@/components/common/SectionWrapper';
import { getSectionComponent } from '@/lib/sectionRegistry';
import { useSectionEditor } from '@/hooks/useSectionEditor';
import { PageSection } from '@/lib/loadPageSections';
import { Fragment } from 'react';

interface PageRendererProps {
  page: string;
  sections: PageSection[];
}

export function PageRenderer({ page, sections }: PageRendererProps) {
  const { isOpen, currentSection, openEditor, closeEditor, updateSection } = useSectionEditor();
  return (
    <>
      {sections.map((section) => {
        const component = getSectionComponent(page, section.name);
        
        if (!component) {
          console.warn(`No component found for section: ${page}/${section.name}`);
          return null;
        }

        const { View, AdminForm } = component;

        return (
          <Fragment key={section.name}>
            <SectionWrapper
              page={page}
              section={section.name}
              data={section.data}
              onEdit={openEditor}
            >
              <View data={section.data} />
            </SectionWrapper>
          </Fragment>
        );
      })}

      {currentSection && (() => {
        const sectionComponent = getSectionComponent(currentSection.page, currentSection.section);
        if (!sectionComponent?.AdminForm) return null;
        
        const AdminFormComponent = sectionComponent.AdminForm;
        return (
          <AdminFormComponent
            isOpen={isOpen}
            onClose={closeEditor}
            data={currentSection.data}
            onSave={updateSection}
          />
        );
      })()}
    </>
  );
}