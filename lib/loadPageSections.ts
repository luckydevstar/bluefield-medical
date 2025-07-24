import fs from 'fs';
import path from 'path';

export interface PageSection {
  name: string;
  data: any;
}

export async function loadPageSections(page: string): Promise<PageSection[]> {
  const dataDir = path.join(process.cwd(), 'src', 'data', 'pages', page);
  
  try {
    const files = fs.readdirSync(dataDir);
    const sections: PageSection[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const sectionName = file.replace('.json', '');
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        sections.push({
          name: sectionName,
          data,
        });
      }
    }

    return sections;
  } catch (error) {
    console.error(`Error loading sections for page ${page}:`, error);
    return [];
  }
}

export async function saveSectionData(page: string, section: string, data: any): Promise<void> {
  const dataDir = path.join(process.cwd(), 'src', 'data', 'pages', page);
  const filePath = path.join(dataDir, `${section}.json`);
  
  // Ensure directory exists
  fs.mkdirSync(dataDir, { recursive: true });
  
  // Write the updated data
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}