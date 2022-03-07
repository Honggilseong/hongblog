import React, { Dispatch, SetStateAction } from 'react'
import { Category } from '../typings'

interface Props {
  categories: [Category]
  categorySearchSet: Dispatch<SetStateAction<string>>
  searchPostSet: Dispatch<SetStateAction<string>>
  isPostsSearchSet: Dispatch<SetStateAction<boolean>>
}

function CategoryBar({
  categories,
  categorySearchSet,
  searchPostSet,
  isPostsSearchSet,
}: Props) {
  const categoriesClickHandler = (category: string) => {
    console.log(category)
    categorySearchSet(category)
    searchPostSet('')
    isPostsSearchSet(true)
  }
  const seeAllThePostsClickHandler = () => {
    isPostsSearchSet(false)
    searchPostSet('')
  }
  return (
    <div>
      <h1 className=" font-bold">태그 목록</h1>
      <hr className=" border-1 mb-6 border-black" />
      <p
        className="mb-1 cursor-pointer hover:text-gray-300"
        onClick={() => seeAllThePostsClickHandler()}
      >
        전체 게시글
      </p>
      {categories.map((category) => (
        <div
          key={category._id}
          className=" mb-1 cursor-pointer hover:text-gray-300"
          onClick={() => categoriesClickHandler(category._id)}
        >
          <p>{category.title}</p>
        </div>
      ))}
    </div>
  )
}

export default CategoryBar
