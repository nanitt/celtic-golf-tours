import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schema';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder';

export default defineConfig({
  name: 'celtic-golf-tours',
  title: 'Celtic Golf Tours',
  projectId,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
