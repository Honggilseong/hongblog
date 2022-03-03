import Link from 'next/link'
import React from 'react'
import { urlFor } from '../sanity'
import { Category, Post } from '../typings'
interface Props {
  post: Post
}
function Posts({ post }: Props) {
  return (
    <Link key={post._id} href={`/post/${post.slug.current}`}>
      <div className="group cursor-pointer overflow-hidden border-2">
        {post.mainImage && (
          <img
            className="h-60 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
            src={urlFor(post.mainImage).url()}
          />
        )}
        <div className="justify-between p-5">
          <p className="text-lg font-bold ">{post.title}</p>
          <p>{post.publishedAt}</p>
        </div>
      </div>
    </Link>
  )
}

export default Posts
