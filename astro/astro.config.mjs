import { defineConfig } from "astro/config";
import sanity from "astro-sanity";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanity({
      projectId: "d4exw40d",
      dataset: "production",
      apiVersion: "2021-03-25",
      useCdn: true,
    }),
    solidJs(),
  ],
});
