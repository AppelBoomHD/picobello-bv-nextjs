import { GetStaticPathsResult, GetStaticPropsResult } from "next";
import Head from "next/head";
import { DrupalNode } from "next-drupal";

import { drupal } from "lib/drupal";
import { NodeArticle } from "components/node--article";
import { NodeBasicPage } from "components/node--basic-page";
import { Layout } from "components/layout";
import { NodeBlog } from "components/node--blog";
import { Trip } from "components/trip";

const RESOURCE_TYPES = [
  "node--page",
  "node--article",
  "node--blog",
  "trip_admin_trip--trip_admin_trip",
];

interface NodePageProps {
  resource: any;
}

export default function NodePage({ resource }: NodePageProps) {
  if (!resource) return null;

  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta name="description" content="A Next.js site powered by Drupal." />
      </Head>
      {resource.type === "node--page" && <NodeBasicPage node={resource} />}
      {resource.type === "node--article" && <NodeArticle node={resource} />}
      {resource.type === "node--blog" && <NodeBlog node={resource} />}
      {resource.type === "trip_admin_trip--trip_admin_trip" && (
        <Trip trip={resource} />
      )}
    </Layout>
  );
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  return {
    paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context),
    fallback: "blocking",
  };
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<NodePageProps>> {
  const path = await drupal.translatePathFromContext(context, {
    withAuth: true,
  });

  if (!path) {
    return {
      notFound: true,
    };
  }

  const type = path.jsonapi.resourceName;

  let params = {};
  if (type === "node--article") {
    params = {
      include: "field_image,uid",
    };
  }

  if (type === "node--blog") {
    params = {
      include: "uid",
    };
  }

  if (type === "trip_admin_trip--trip_admin_trip") {
    params = {
      include: "stops",
    };
  }

  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params,
      withAuth: true,
    }
  );

  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      resource,
    },
  };
}
