'use client';

import { ReactNode } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminMode } from '@/hooks/useAdminMode';
import { SectionData } from '@/hooks/useSectionEditor';

interface SectionWrapperProps {
  children: ReactNode;
  page: string;
  section: string;
  data: SectionData;
  onEdit: (page: string, section: string, data: SectionData) => void;
}

export function SectionWrapper({ 
  children, 
  page, 
  section, 
  data, 
  onEdit 
}: SectionWrapperProps) {
  const { isAdmin } = useAdminMode();

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div 
      className="relative group transition-all duration-200 hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50"
      style={{ isolation: 'isolate' }}
    >
      {children}
      
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        <Button
          size="sm"
          onClick={() => onEdit(page, section, data)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>
      
      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
}