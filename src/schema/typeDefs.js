import path from 'path';
import { fileURLToPath } from 'url';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all .graphql files inside src/modules recursively
const typesArray = loadFilesSync(path.join(__dirname, '../modules/**/*.graphql'));

// Merge all type definitions into a single schema
export const typeDefs = mergeTypeDefs(typesArray);