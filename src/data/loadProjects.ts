import * as Papa from 'papaparse';

export interface ResearchProject {
  id: string;
  title: string;
  researcher: string;
  category: string;
  phase: string;
  description: string;
  position: [number, number];
  partners?: string[];
  startDate?: string;
  completionDate?: string;
  image?: string;
}

interface CSVRow {
  id: string;
  title: string;
  researcher: string;
  category: string;
  phase: string;
  description: string;
  latitude: string;
  longitude: string;
  partners: string;
  startDate: string;
  completionDate: string;
}

export async function loadProjects(): Promise<ResearchProject[]> {
  try {
    const response = await fetch('/data/research_projects.csv');
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<CSVRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const projects: ResearchProject[] = results.data.map((row) => {
            // Parse partners (pipe-separated)
            const partners = row.partners
              ? row.partners.split('|').filter(p => p.trim())
              : undefined;

            return {
              id: row.id,
              title: row.title,
              researcher: row.researcher,
              category: row.category,
              phase: row.phase,
              description: row.description,
              position: [parseFloat(row.latitude), parseFloat(row.longitude)],
              partners,
              startDate: row.startDate || undefined,
              completionDate: row.completionDate || undefined,
              // Generate placeholder image based on category
              image: `https://images.unsplash.com/photo-${getCategoryImageId(row.category)}?w=800`
            };
          });

          resolve(projects);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// Helper to get category-appropriate Unsplash image IDs
function getCategoryImageId(category: string): string {
  const imageMap: Record<string, string> = {
    'psychology': '1497366216548-37526070297c', // Office/workspace
    'health-safety': '1519389950473-47ba0277781c', // Architecture
    'sustainability': '1497366811353-6870744d04b2', // Green building
    'immersive': '1522202176988-66273c2fd55f', // Learning space
    'campus-life': '1523050854058-8df90110c9f1', // Campus
    'fine-arts': '1513694203232-719a280e022f' // Arts space
  };

  return imageMap[category] || '1497366216548-37526070297c';
}