import { createClient } from '@supabase/supabase-js';

export interface PageSection {
  name: string;
  data: any;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function loadPageSections(page: string, list: string[]): Promise<PageSection[]> {
  try {
    const { data, error } = await supabase
      .from('page_sections')
      .select('section_name, data')
      .eq('page_name', page)
      .in('section_name', list);

    if (error) {
      console.error(`Error loading sections for ${page}:`, error.message);
      return [];
    }

    const sectionMap = new Map(data.map((item) => [item.section_name, item.data]));

    // Preserve order of the original list
    const sections = list
      .map((sectionName) => {
        const data = sectionMap.get(sectionName);
        if (!data) return null;
        return { name: sectionName, data };
      })
      .filter(Boolean); // Remove any missing sections if necessary

    return sections as PageSection[];
  } catch (error) {
    console.error(`Unexpected error loading sections for ${page}:`, error);
    return [];
  }
}

export async function saveSectionData(page: string, section: string, data: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('page_sections')
      .update({ page_name: page, section_name: section, data })
      .eq('page_name', page)
      .eq('section_name', section); // This is now valid

    if (error) {
      console.error(`Failed to save section ${section} of page ${page}:`, error.message);
      throw error;
    }
  } catch (error) {
    console.error(`Unexpected error saving section ${section} of page ${page}:`, error);
    throw error;
  }
}
