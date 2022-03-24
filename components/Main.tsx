import React, { useEffect, useState } from 'react'
import { Category, Post } from '../typings'
import { urlFor } from '../sanity'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import ReactPaginate from 'react-paginate'
import CategoryBar from './CategoryBar'
import PostRender from './PostRender'
import mainImage from '../public/main.jpg'

interface Props {
  posts: [Post]
  categories: [Category]
}

const POSTS_PER_PAGE = 6
function Main({ posts, categories }: Props) {
  const [searchPost, searchPostSet] = useState('')
  const [categorySearch, categorySearchSet] = useState('')
  const [currentPage, currentPageSet] = useState(0)
  const [itemOffset, itemOffsetSet] = useState(0)
  const [currentItems, currentItemsSet] = useState([] as any)
  const [isPostsSearch, isPostsSearchSet] = useState(false)

  useEffect(() => {
    isPostsSearchSet(true)
    categorySearchSet('')
    if (!searchPost) isPostsSearchSet(false)
  }, [searchPost])
  useEffect(() => {
    searchPostSet('')
  }, [categorySearch])
  useEffect(() => {
    const endOffset = itemOffset + POSTS_PER_PAGE
    currentItemsSet(posts.slice(itemOffset, endOffset))
    currentPageSet(Math.ceil(posts.length / POSTS_PER_PAGE))
  }, [itemOffset, currentPage])

  const handlePageClick = (event: any) => {
    console.log(event)
    const newOffset = (event.selected * POSTS_PER_PAGE) % posts.length
    itemOffsetSet(newOffset)
    currentPageSet(event.selected)
  }
  return (
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
          {isPostsSearch
            ? categorySearch
              ? posts
                  .filter((post) =>
                    post.categories.some(
                      (category) => category._ref === categorySearch
                    )
                  )
                  .map((post) => {
                    return <PostRender key={post._id} post={post} />
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
                    return <PostRender key={post._id} post={post} />
                  })
            : currentItems.map((post: any) => {
                return <PostRender key={post._id} post={post} />
              })}
        </div>
        {!isPostsSearch && (
          <ReactPaginate
            nextLabel=">"
            previousLabel="<"
            breakLabel="..."
            pageCount={currentPage}
            onPageChange={handlePageClick}
            className="mt-4 flex cursor-pointer items-center justify-center"
            previousClassName="w-10 h-10 flex justify-center items-center dark:bg-black dark:text-white"
            nextClassName="w-10 h-10 flex justify-center items-center dark:bg-black dark:text-white"
            pageClassName="w-10 h-10 flex justify-center items-center bg-blue-400 border text-white dark:bg-black"
            pageLinkClassName="w-10 h-10 flex justify-center items-center "
            disabledClassName="bg-white"
            pageRangeDisplayed={4}
          />
        )}
      </div>
      <div className="hidden w-72 p-5 md:inline-flex">
        <CategoryBar
          posts={posts}
          categories={categories}
          categorySearchSet={categorySearchSet}
          searchPostSet={searchPostSet}
          isPostsSearchSet={isPostsSearchSet}
        />
      </div>
    </div>
  )
}

export default Main
