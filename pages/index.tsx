import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CategoryBar from '../components/CategoryBar'
import Header from '../components/Header'
import Posts from '../components/Posts'
import mainImage from '../public/main.jpg'
import { sanityClient, urlFor } from '../sanity'
import { Post, Category } from '../typings'

interface Props {
  posts: [Post]
  categories: [Category]
}

const Home = ({ posts, categories }: Props) => {
  const [searchPost, searchPostSet] = useState('')
  const [isCategory, isCategorySet] = useState('')
  useEffect(() => {
    isCategorySet('')
  }, [searchPost])
  useEffect(() => {
    searchPostSet('')
  }, [isCategory])
  return (
    <div className="h-full w-full dark:text-white">
      <Head>
        <title>Hong's Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className=" mx-auto flex max-w-7xl flex-row p-0 md:p-5">
        <div className=" mr-4">
          <Image src={mainImage} width={1800} height={300} />
          <div className=" p-2 md:p-0">
            <p className=" mb-3 text-xl font-bold">게시글 검색</p>
            <input
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-blue-400 focus:ring md:w-60"
              type="text"
              onChange={(event) => searchPostSet(event.target.value)}
              placeholder="검색어를 입력해주세요."
              value={searchPost}
            />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-0 lg:grid-cols-3">
            {isCategory
              ? posts
                  .filter((post) =>
                    post.categories.some(
                      (category) => category._ref === isCategory
                    )
                  )
                  .map((post) => {
                    return <Posts post={post} />
                  })
              : posts
                  .filter((searchWord) => {
                    if (!searchWord) {
                      return searchWord
                    } else if (
                      searchWord.title
                        .toLowerCase()
                        .trim()
                        .includes(searchPost.toLowerCase().trim())
                    ) {
                      return searchWord
                    }
                  })
                  .map((post) => {
                    return <Posts post={post} />
                  })}
          </div>
        </div>
        <div className="hidden w-72 p-5 md:inline-flex">
          <CategoryBar
            categories={categories}
            isCategorySet={isCategorySet}
            searchPostSet={searchPostSet}
          />
        </div>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const postQuery = `*[_type == "post"]{
    _id,
    title,
    slug,
    author-> {
      name,
      image
    },
    mainImage,
    publishedAt,
    categories,
  }`

  const categoryQuery = `*[_type == "category"]{
    _id,
    title
  }`
  const posts = await sanityClient.fetch(postQuery)
  const categories = await sanityClient.fetch(categoryQuery)
  return {
    props: {
      posts,
      categories,
    },
  }
}
