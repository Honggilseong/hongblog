import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { urlFor } from '../sanity'
import { Category, Post } from '../typings'
interface Props {
  post: Post
}
function PostRender({ post }: Props) {
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
          <p className=" truncate text-lg font-bold">{post.title}</p>
          <p className=" text-gray-400">
            {moment(post.publishedAt).format('YY-DD-MM')}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default PostRender
