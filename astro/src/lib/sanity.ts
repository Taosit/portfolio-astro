import { useSanityClient, groq } from "astro-sanity";
import translate from "translate-google";

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
  const wordsToKeep = ["Notes", "Chat"];
  const translatedProjects = await Promise.all(
    projects.map(async (project: Project) => ({
      ...project,
      videos: await Promise.all(
        project.videos.map(async (video) => ({
          ...video,
          name: {
            en: video.name,
            fr: wordsToKeep.includes(video.name)
              ? video.name
              : await translate(video.name, { to: "fr" }),
          },
        }))
      ),
      description: {
        en: project.description,
        fr: (
          await translate(project.description, { to: "fr" })
        )
          .split(".")
          .map((sentence: string) => sentence.trim())
          .join(". "),
      },
    }))
  );
  translatedProjects[0].description.fr =
    translatedProjects[0].description.fr.replace(
      "Il prend en charge les séances de jeu simulées. ",
      "Il permet des sessions de jeu simultanées. "
    );
  translatedProjects[0].description.fr =
    translatedProjects[0].description.fr.replace(
      "donner des notes",
      "évaluer les réponses des autres joueurs"
    );
  translatedProjects[1].description.fr =
    translatedProjects[1].description.fr.replace("sans main", "main libre");
  translatedProjects[2].description.fr =
    translatedProjects[2].description.fr.replace("de mandarin", "en mandarin");
  translatedProjects[2].description.fr =
    translatedProjects[2].description.fr.replace("entre", "fourni par");
  translatedProjects[2].description.fr =
    translatedProjects[2].description.fr.replace(
      "la sortie sous forme de PDF",
      "le PDF"
    );
  translatedProjects[3].description.fr =
    translatedProjects[3].description.fr.replace(
      "l'emplacement",
      "leurs régions"
    );

  return translatedProjects
    .map((project: TranslatedProject) => project)
    .sort((a: TranslatedProject, b: TranslatedProject) => a.order - b.order);
}
