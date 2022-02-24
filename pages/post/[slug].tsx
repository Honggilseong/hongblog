import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'

interface Props {
  post: Post
}
interface CommentInput {
  _id: string
  name: string
  comment: string
}

function PostSlug({ post }: Props) {
  const [isSubmitted, isSubmittedSet] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentInput>()

  const addCommentHandler: SubmitHandler<CommentInput> = async (
    userComment
  ) => {
    await fetch('/api/addComment', {
      method: 'POST',
      body: JSON.stringify(userComment),
    })
      .then(() => {
        console.log('성공')
        isSubmittedSet(true)
      })
      .catch((error) => {
        console.log('addCommentError! =>', error)
        isSubmittedSet(false)
      })
  }
  return (
    <div className="h-full w-full">
      <Header />
      <img
        className="h-60 w-full object-cover"
        src={urlFor(post.mainImage).url()}
        alt="postMainImage"
      />
      <article className="mx-auto mt-4 max-w-3xl border-2 border-white p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt="authorImage"
          />
          <p>{post.author.name}</p>
        </div>

        <div className=" mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 ml-4 font-bold " {...props} />
              ),
              blockquote: ({ children }: any) => (
                <li className="ml-4 list-disc ">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-white hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-blue-500" />
      <form
        className="mx-auto max-w-2xl p-5 md:p-0"
        onSubmit={handleSubmit(addCommentHandler)}
      >
        <h3 className="mb-4 text-2xl font-bold">
          이 게시글이 마음에 드셨거나 의견이 있으신가요?
        </h3>
        <h3 className=" mb-4 underline">댓글을 남겨주세요!</h3>
        <input {...register('_id')} type="hidden" name="_id" value={post._id} />
        <label>
          <span>닉네임</span>
          <input
            {...register('name', { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-blue-400 focus:ring"
            type="text"
            name="name"
          />
        </label>
        <label>
          <span className="my-2">댓글</span>
          <textarea
            {...register('comment', { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none  ring-blue-400 focus:ring"
            rows={3}
          />
        </label>
        <input
          type="submit"
          className="focus:shadow-outline mt-4 cursor-pointer rounded bg-blue-400 py-2 px-4 font-bold text-white shadow hover:bg-blue-500 focus:outline-none"
        />
      </form>
      <div className="mx-auto  max-w-2xl p-5 md:p-0">
        {errors.name && <p className=" text-red-600">이름을 적어주세요</p>}
        {errors.comment && <p className=" text-red-600">댓글을 적어주세요.</p>}
      </div>
      <hr className="my-5 mx-auto max-w-lg border border-blue-500" />
      <section className=" mx-auto max-w-2xl p-5 md:p-0">
        <h3 className=" mb-5 text-xl font-bold">댓글</h3>

        {post.comments.map((comment) => (
          <div className=" mb-2 border-b-2">
            <p>
              <span className="font-bold">{comment.name}</span>:{' '}
              {comment.comment}
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default PostSlug

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createAt,
        title,
        author-> {
        name,
        image
       },
       'comments': *[
         _type == "comment" &&
         post._ref == ^._id &&
         approved == true
       ],
       description,
      mainImage,
      slug,
      body
      }`

  const post = await sanityClient.fetch(query, { slug: params?.slug })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
