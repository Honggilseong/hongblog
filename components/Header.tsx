import Link from 'next/link'

function Header() {
  return (
    <header className=" mx-auto max-w-7xl p-5">
      <div className="flex items-center justify-between">
        <Link href="/">
          <p className=" color-white cursor-pointer text-xl font-bold text-white">
            Hong's Blog
          </p>
        </Link>
      </div>
    </header>
  )
}

export default Header
