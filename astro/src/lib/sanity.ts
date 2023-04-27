import { useSanityClient, groq } from "astro-sanity";
import type { Project } from "./types";

export async function getProjects() {
  const query = groq`*[_type == "project"]{
    name,
    order,
    description,
    technologies,
    url,
    github,
    "imageUrl": image.asset->url,
    videos[]{
      "url": asset->url,
      name
    }
  } | order(order asc)`;
  const projects = await useSanityClient().fetch(query);
  return projects.map((project: Project) => project);
}
