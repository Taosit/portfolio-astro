export interface Project {
  name: string;
  order: number;
  description: string;
  technologies: string[];
  url: string;
  github: string;
  imageUrl: string;
  videos: {
    name: string;
    url: string;
  }[];
}
