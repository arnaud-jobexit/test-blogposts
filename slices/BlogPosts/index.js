import React from 'react'
import { PrismicRichText, PrismicLink } from '@prismicio/react'
import { createClient } from '../../prismicio'
/**
 * @typedef {import("@prismicio/client").Content.BlogPostsSlice} BlogPostsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BlogPostsSlice>} BlogPostsProps
 * @param { BlogPostsProps }
 */
const BlogPosts = ({ slice, document }) => {
  console.log(slice)
  console.log(document)
  return (
    <section className='container px-5 mx-auto py-24'>
      <div className='text-center flex flex-col space-y-4'>
        <span className="">
          <PrismicRichText field={slice.primary.title}/>
        </span>
        <span className=''>
          <PrismicRichText field={slice.primary.description}/>
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-8">
          {slice.items.map((item) => (
            <li key={item.blogpost.id} className="bg-gray-100" >
              <div className='bg-gray-200 h-24 flex flex-col justify-center items-center text-center'>
                <span className="">Picture</span>
              </div>
              <div className='p-5 flex flex-col space-y-2'>
                <span>Title : xxxxxxxxxxx</span>
                <span>Content : xxxxxxxxxxx</span>
                <span>Author : xxxxxxxxxxx</span>
                <div className='mt-2'>
                  Link to the post : <PrismicLink document={item.blogpost}>Link</PrismicLink>
                </div>
              </div>
            </li>
          ))}
      </ul>
      
    </section>
  )
}

export default BlogPosts

export async function getStaticProps({ params, locale, previewData }) {
  const client = createClient({ previewData });
  client.getByUID("blogposts", params.uid, {
    graphQuery: `
    {
      author {
        name,
        position,
        picture
      }
    }
  `
  ,lang: locale });

  return {
    props: { document },
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
