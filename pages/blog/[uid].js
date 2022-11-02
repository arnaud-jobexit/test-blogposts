import Head from "next/head";
import { SliceZone } from "@prismicio/react";
import * as prismicH from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";

import { createClient } from "../../prismicio";
import { components } from "../../slices";
import { Layout } from "../../components/Layout";
import { PrismicRichText } from '@prismicio/react'

const Page = ({ document, navigation, settings }) => {
  console.log("document : ", document)
  return (
    <Layout navigation={navigation} settings={settings}>
      <Head>
        <title>
          {prismicH.asText(document.data.title)}
        </title>
      </Head>
      <section className="container px-5 mx-auto flex flex-col">
        <div className="">
          <PrismicRichText field={document.data.title}/>
        </div>
        <div className="w-96 h-96 bg-red-600 relative">
          <PrismicNextImage
            field={document.data.picture}
            alt=""
            layout="fill"
            className="pointer-events-none select-none object-cover"
          />
        </div>
        <div className="">
          <PrismicRichText field={document.data.contenttext}/>
        </div>
        <div className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="relative rounded-full overflow-hidden w-12 h-12 border border-gray-400">
              <PrismicNextImage
                field={document.data.author.data.picture}
                alt=""
                layout="fill"
                className="pointer-events-none select-none object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">{document.data.author.data.name}</span>
              <span className="">{document.data.author.data.position}</span>
            </div>            
          </div>
        </div>
      </section>
      <SliceZone slices={document.data.slices} components={components} />
    </Layout>
  );
};

export default Page;

export async function getStaticProps({ params, locale, previewData }) {
  const client = createClient({ previewData });
  const document = await client.getByUID("blogposts", params.uid, {
        graphQuery: `
        {
          blogposts {
            uid
            title
            picture
            contenttext
            author {
              ...on author {
                uid
                picture
                name
                position
              }
            }
          }
        }
      `})
      const navigation = await client.getSingle("navigation", { lang: locale });
      const settings = await client.getSingle("settings", { lang: locale });
  return {
    props: { document ,navigation, settings},
  };
}

export async function getStaticPaths() {
  const client = createClient();
  const posts = await client.getAllByType("blogposts", { lang: "*" });
  return {
    paths: posts.map((post) => {
      return {
        params: { uid: post.uid },
        locale: post.lang,
      };
    }),
    fallback: false,
  };
}



