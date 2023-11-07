import Head from "next/head";
import { GetStaticPropsResult } from "next";
import { DrupalNode } from "next-drupal";

import { drupal } from "lib/drupal";
import { Layout } from "components/layout";
import { NodeBlogTeaser } from "components/node--blog--teaser";

interface IndexPageProps {
  nodes: DrupalNode[];
}

export default function IndexPage({ nodes }: IndexPageProps) {
  return (
    <Layout>
      <Head>
        <title>Picobello B.V.</title>
        <meta
          name="description"
          content="Trip administration system for Picobello B.V."
        />
      </Head>
      <div>
        <h1 className="mb-10 text-6xl font-black">Latest blog posts.</h1>
        {nodes?.length ? (
          nodes.map((node) => (
            <div key={node.id}>
              <NodeBlogTeaser node={node} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<IndexPageProps>> {
  const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--blog",
    context,
    {
      params: {
        "filter[status]": 1,
        "fields[node--blog]": "title,path,uid,created",
        include: "uid",
        sort: "-created",
      },
    }
  );

  return {
    props: {
      nodes,
    },
  };
}
