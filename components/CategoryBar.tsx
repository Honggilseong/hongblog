import React, { Dispatch, SetStateAction } from 'react'
import { Category } from '../typings'

interface Props {
  categories: [Category]
  isCategorySet: Dispatch<SetStateAction<string>>
}

function CategoryBar({ categories, isCategorySet }: Props) {
  const onCategoriesClickHandler = (category: string) => {
    console.log(category)
    isCategorySet(category)
  }
  return (
    <div>
      <h1 className=" font-bold">태그 목록</h1>
      <hr className=" border-1 mb-6 border-black" />
      {categories.map((category) => (
        <div
          key={category._id}
          className=" mb-1 cursor-pointer hover:text-gray-300"
          onClick={() => onCategoriesClickHandler(category._ref)}
        >
          <p>{category.title}</p>
        </div>
      ))}
    </div>
  )
}

export default CategoryBar