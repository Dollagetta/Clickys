import { createClient as baseCreateClient } from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "./slicemachine.config.json" with { type: "json" };

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
// TODO: Update the routes array to match your project's route structure.
const routes = [
  { type: "pinterestgrid", path: "/:uid" },
  { type: "sliceguide1", path: "/guide/:uid" },
  { type: "whatsnew", path: "/whats-new/:uid" },
  { type: "product", path: "/products/:uid" },
  { type: "category", path: "/categories/:uid" },
  { type: "affiliate", path: "/affiliate/:uid" },
  { type: "partner", path: "/partners/:uid" },
  { type: "marketingbanner", path: "/marketing/:uid" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config = {}) => {
  const client = baseCreateClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({
    client,
    ...config,
  });

  return client;
};

