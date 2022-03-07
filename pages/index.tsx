import { sanityClient } from '../sanity'
import { Post, Category } from '../typings'
import Head from 'next/head'
import Header from '../components/Header'
import Main from '../components/Main'

interface Props {
  posts: [Post]
  categories: [Category]
}

const Home = ({ posts, categories }: Props) => {
  return (
    <div className="h-full w-full dark:text-white">
      <Head>
        <title>Hong's Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main posts={posts} categories={categories} />
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
