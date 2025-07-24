'use client';

import { useState } from 'react';

export interface SectionData {
  [key: string]: any;
}

export function useSectionEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<{
    page: string;
    section: string;
    data: SectionData;
  } | null>(null);
  
  const openEditor = (page: string, section: string, data: SectionData) => {
    setCurrentSection({ page, section, data });
    setIsOpen(true);
  };

  const closeEditor = () => {
    setIsOpen(false);
    setCurrentSection(null);
  };

  const updateSection = async (updatedData: SectionData) => {
    if (!currentSection) return;

    try {
      const response = await fetch(`/api/sections/${currentSection.page}/${currentSection.section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update section');
      }

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  return {
    isOpen,
    currentSection,
    openEditor,
    closeEditor,
    updateSection,
  };
}