import projectsData from "../../content/projects.json";
import type { Locale } from "@/i18n";

export type Project = (typeof projectsData)[number];
export const projects: Project[] = projectsData;

const englishDescriptions: Record<string, string> = {
  "mr-leo-apple-orchard": "4 bedrooms plus 1 master bedroom, swimming pool and garden; stated building area approximately 500 m².",
  "berawa-villa": "3 villa units, each with 2 bedrooms, living and dining area, kitchen, and pool. Each unit is approximately 145 m².",
  "padonan-villa": "2 bedrooms, open-plan living room, and a small pool.",
  "kwanji-villa": "2 bedrooms, open-plan living room, and a small pool.",
  "nuansa-balian-house": "3 floors, 4 bedrooms including a staff bedroom, family room, and a two-car garage.",
  "buluh-indah-apartment": "3 apartment units and 1 office; each apartment has 3 bedrooms, a living room and kitchen, with approximately 140 m² per unit.",
  "tabanan": "A house with 6 planned boarding rooms intended as an exclusive boarding house.",
  "tabanan-house-1": "1 master bedroom, 2 other bedrooms, a kitchen, and a living room.",
  "tabanan-house-2": "1 master bedroom, 3 other bedrooms, and a living room.",
  "batanghari-house": "1 master bedroom, 3 children's bedrooms, a staff bedroom, gym, and living room.",
  "villa-kamanda": "Interior work.",
  "villa-tabayuh": "Interior work.",
  "villa-bozec": "Interior work.",
  "villa-richard-swanelli": "Interior work.",
  "villa-braunsteiner": "Interior work.",
};

export const projectDescription = (project: Project, locale: Locale) =>
  locale === "en" ? englishDescriptions[project.slug] : project.descriptionID;
