import * as Papa from 'papaparse';

export interface DistrictAttributes {
  GEOID20: string;
  COLOR: string;
  DISTRICT: string;
  DISTRICT_N: string;
  NAME: string;
  Office_Controller: string;
  Pfluger_Tier_Rank: string;
}

export interface DistrictShape {
  GEOID20: string;
  geometry_type: string;
  coordinates: string;
}

export interface District {
  geoid: string;
  name: string;
  district: string;
  office: string;
  color: string;
  geometry: any; // GeoJSON geometry
}

export async function loadDistricts(): Promise<District[]> {
  try {
    // Load both CSVs
    const [attributesResponse, shapesResponse] = await Promise.all([
      fetch('/data/district_attributes.csv'),
      fetch('/data/district_shapes.csv')
    ]);

    const [attributesText, shapesText] = await Promise.all([
      attributesResponse.text(),
      shapesResponse.text()
    ]);

    // Parse CSVs
    const attributesResult = Papa.parse<DistrictAttributes>(attributesText, {
      header: true,
      skipEmptyLines: true
    });

    const shapesResult = Papa.parse<DistrictShape>(shapesText, {
      header: true,
      skipEmptyLines: true
    });

    // Create a map of shapes by GEOID20
    const shapesMap = new Map<string, DistrictShape>();
    shapesResult.data.forEach(shape => {
      shapesMap.set(shape.GEOID20, shape);
    });

    // Combine attributes and shapes
    const districts: District[] = [];

    attributesResult.data.forEach(attr => {
      const shape = shapesMap.get(attr.GEOID20);
      if (shape && attr.Office_Controller && attr.Office_Controller !== 'UNCATEGORIZED') {
        try {
          // Parse coordinates from string
          const coordinates = JSON.parse(shape.coordinates);

          districts.push({
            geoid: attr.GEOID20,
            name: attr.NAME || attr.DISTRICT_N,
            district: attr.DISTRICT,
            office: attr.Office_Controller,
            color: attr.COLOR || '5',
            geometry: {
              type: shape.geometry_type,
              coordinates: coordinates
            }
          });
        } catch (e) {
          console.warn(`Failed to parse district ${attr.GEOID20}:`, e);
        }
      }
    });

    return districts;
  } catch (error) {
    return [];
  }
}
