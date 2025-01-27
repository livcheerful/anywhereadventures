import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          { type: "string", name: "slug", label: "Slug", required: false },
          {
            type: "string",
            name: "location",
            label: "Location",
            list: true,
            options: [
              { value: "seattle", label: "Seattle" },
              { value: "chicago", label: "Chicago" },
            ],
            required: false,
          },
          {
            type: "object",
            name: "coordinates",
            label: "Coordinates",
            fields: [
              { label: "Longitude", name: "longitude", type: "number" },
              { label: "Latitude", name: "latitude", type: "number" },
            ],
          },

          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "Comic",
                label: "Comic",
                fields: [
                  { name: "image", label: "Image", type: "string" },
                  {
                    name: "position",
                    label: "Position",
                    type: "string",
                    options: [
                      { value: "left", label: "Left" },
                      { value: "right", label: "Right" },
                    ],
                  },
                  {
                    name: "speechBubbles",
                    label: "Speech Bubbles",
                    type: "object",
                    list: true,
                    fields: [
                      {
                        name: "text",
                        label: "Text",
                        type: "string",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        ui: {
          // This is an DEMO router. You can remove this to fit your site
          router: ({ document }) => `/demo/blog/${document._sys.filename}`,
        },
      },
    ],
  },
});
