type Project = {
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
};

type TranslatedProject = {
  name: string;
  order: number;
  description: {
    en: string;
    fr: string;
  };
  technologies: string[];
  url: string;
  github: string;
  imageUrl: string;
  videos: {
    name: {
      en: string;
      fr: string;
    };
    url: string;
  }[];
};

declare module "translate-google";
