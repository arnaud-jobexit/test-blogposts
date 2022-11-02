import Head from "next/head";
import { SliceZone } from "@prismicio/react";
import * as prismicH from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";

import { createClient } from "../../prismicio";
import { components } from "../../slices";
import { Layout } from "../../components/Layout";
import { PrismicRichText } from '@prismicio/react'

const Page = ({ blogposts, navigation, settings }) => {
  
  return (
    <Layout navigation={navigation} settings={settings}>
      <Head>
        <title>
          {prismicH.asText(blogposts.data.title)}
        </title>
      </Head>
      <section className="container px-5 mx-auto flex flex-col">
        <div className="">
          <PrismicRichText field={blogposts.data.title}/>
        </div>
        <div className="w-96 h-96 bg-red-600 relative">
          <PrismicNextImage
            field={blogposts.data.picture}
            alt=""
            layout="fill"
            className="pointer-events-none select-none object-cover"
          />
        </div>
        <div className="">
          <PrismicRichText field={blogposts.data.contenttext}/>
        </div>
        <div className="pt-6">
          <span>Author :</span>
          <div className="flex items-center space-x-2">
            <div className="rounded-full overflow-hidden w-16 h-16 bg-gray-400">
            </div>
            <span className="">ID : {blogposts.data.author.id}</span>
          </div>
        </div>
      </section>
      <SliceZone slices={blogposts.data.slices} components={components} />
    </Layout>
  );
};

export default Page;

export async function getStaticProps({ params, locale, previewData }) {
  const client = createClient({ previewData });

  const blogposts = await client.getByUID("blogposts", params.uid, { lang: locale });
  const navigation = await client.getSingle("navigation", { lang: locale });
  const settings = await client.getSingle("settings", { lang: locale });

  return {
    props: {
        blogposts,
        navigation,
        settings,
    },
  };
}

export async function getStaticPaths() {
  const client = createClient();

  const blogposts = await client.getAllByType("blogposts", { lang: "*" });
  return {
    paths: blogposts.map((avi) => {
      return {
        params: { uid: avi.uid },
        locale: avi.lang,
      };
    }),
    fallback: false,
  };
}
