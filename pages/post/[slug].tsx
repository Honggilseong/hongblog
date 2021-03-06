import { GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import imageGreenCheck from '../../public/green_check.png'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  post: Post
}
interface CommentInput {
  _id: string
  name: string
  comment: string
}

function PostSlug({ post }: Props) {
  const [previousPost, previousPostSet] = useState<Post | null>(null)
  const [nextPost, nextPostSet] = useState<Post | null>(null)
  const [isSubmitted, isSubmittedSet] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentInput>()

  useEffect(() => {
    console.log(post._id)
    const getPreviousNextPosts = async () => {
      const query = `*[_type == "post" && _id == '${post._id}'][0]{
        'previousPost': *[_type == "post" && publishedAt < ^.publishedAt] | order(publishedAt desc)[0],
        'nextPost': *[_type == "post" && publishedAt > ^.publishedAt] | order(publishedAt asc)[0]
      }`

      const fetchPostData = await sanityClient.fetch(query, {
        slug: post.slug.current,
      })

      previousPostSet(fetchPostData?.previousPost)
      nextPostSet(fetchPostData?.nextPost)
    }
    getPreviousNextPosts()
  }, [post])
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
        alert('작성에 실패하였습니다.')
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
      <article className="mx-auto mt-4 max-w-3xl  p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt="authorImage"
          />
          <p>{post.author.name}</p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => <h2 className="my-5 font-bold " {...props} />,
              h3: (props: any) => <h3 className="my-5 font-bold " {...props} />,
              blockquote: ({ children }: any) => (
                <li className="my-2 ml-4 list-disc ">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-700 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <section className="mx-auto mt-5 flex max-w-3xl justify-between p-5 md:p-0 ">
        {nextPost && (
          <Link key={nextPost?._id} href={`/post/${nextPost?.slug.current}`}>
            <div className="cursor-pointer ">
              <p className="font-bold">다음 게시글</p>
              <p>{JSON.stringify(nextPost.title)}</p>
            </div>
          </Link>
        )}
        {!nextPost && <div></div>}
        {previousPost && (
          <Link
            key={previousPost?._id}
            href={`/post/${previousPost?.slug.current}`}
          >
            <div className="cursor-pointer">
              <p className="flex flex-row-reverse font-bold">이전 게시글</p>
              <p>{JSON.stringify(previousPost.title)}</p>
            </div>
          </Link>
        )}
      </section>
      <hr className="my-5 mx-auto max-w-lg border border-blue-500" />
      {isSubmitted ? (
        <div className="mx-auto flex max-w-2xl flex-col items-center p-5 md:p-0">
          <Image src={imageGreenCheck} height={100} width={100} />
          <h3 className="my-4 text-2xl font-bold">
            댓글을 작성해 주셔서 감사합니다.
          </h3>
          <p>댓글은 관리자 검토후에 작성이 완료됩니다.</p>
        </div>
      ) : (
        <>
          <form
            className="mx-auto max-w-2xl p-5 md:p-0"
            onSubmit={handleSubmit(addCommentHandler)}
          >
            <h3 className="mb-4 text-2xl font-bold">
              이 게시글이 마음에 드셨거나 의견이 있으신가요?
            </h3>
            <h3 className=" mb-4 underline">댓글을 남겨주세요!</h3>
            <input
              {...register('_id')}
              type="hidden"
              name="_id"
              value={post._id}
            />
            <label>
              <span>닉네임</span>
              <input
                {...register('name', { required: true })}
                className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-blue-400 focus:ring dark:border-0 dark:bg-slate-600"
                type="text"
                name="name"
              />
            </label>
            <label>
              <span className="my-2">댓글</span>
              <textarea
                {...register('comment', { required: true })}
                className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none  ring-blue-400 focus:ring dark:border-0 dark:bg-slate-600"
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
            {errors.comment && (
              <p className=" text-red-600">댓글을 적어주세요.</p>
            )}
          </div>
        </>
      )}
      <hr className="my-5 mx-auto max-w-lg border border-blue-500" />
      <section className=" mx-auto max-w-2xl p-5 md:p-0">
        <h3 className=" mb-5 text-xl font-bold">댓글</h3>

        {post.comments.length !== 0 ? (
          post.comments.map((comment) => (
            <div key={comment._id} className=" mb-2 border-b-2">
              <p>
                <span className="font-bold">{comment.name}</span>:{' '}
                {comment.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="h-28">
            <p className="text-gray-400">작성된 댓글이 없습니다.</p>
          </div>
        )}
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
