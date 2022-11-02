import Head from "next/head";
import { SliceZone } from "@prismicio/react";
import * as prismicH from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";

import { createClient } from "../../prismicio";
import { components } from "../../slices";
import { Layout } from "../../components/Layout";
import { PrismicRichText } from '@prismicio/react'

const Page = ({ author, navigation, settings }) => {
  console.log(author)
  return (
    <Layout navigation={navigation} settings={settings}>
      <Head>
        <title>
          Lorem
        </title>
      </Head>
      <section className="container px-5 mx-auto flex flex-col">
        <div className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="rounded-full overflow-hidden w-16 h-16 relative border border-gray-400">
              <PrismicNextImage
              field={author.data.picture}
              alt=""
              layout="fill"
              className="pointer-events-none select-none object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="">{author.data.name}</span>
              <span className="">{author.data.position}</span>
            </div>
          </div>
        </div>
      </section>
      <SliceZone slices={author.data.slices} components={components} />
    </Layout>
  );
};

export default Page;

export async function getStaticProps({ params, locale, previewData }) {
  const client = createClient({ previewData });

  const author = await client.getByUID("author", params.uid, { lang: locale });
  const navigation = await client.getSingle("navigation", { lang: locale });
  const settings = await client.getSingle("settings", { lang: locale });

  return {
    props: {
        author,
        navigation,
        settings,
    },
  };
}

export async function getStaticPaths() {
  const client = createClient();

  const author = await client.getAllByType("author", { lang: "*" });
  return {
    paths: author.map((avi) => {
      return {
        params: { uid: avi.uid },
        locale: avi.lang,
      };
    }),
    fallback: false,
  };
}
