// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"core-concepts.mdx": () => import("../content/docs/core-concepts.mdx?collection=docs"), "dashboard.mdx": () => import("../content/docs/dashboard.mdx?collection=docs"), "data-model.mdx": () => import("../content/docs/data-model.mdx?collection=docs"), "getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "introduction.mdx": () => import("../content/docs/introduction.mdx?collection=docs"), }),
};
export default browserCollections;