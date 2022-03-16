import { useTheme } from 'next-themes'
import Link from 'next/link'
import iconSun from '../public/sun.png'
import iconMoon from '../public/moon.png'

function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  return (
    <header className=" mx-auto max-w-7xl p-5">
      <div className="flex items-center justify-between">
        <Link href="/">
          <p className="color-white cursor-pointer text-xl font-bold dark:text-white ">
            Hong's Blog
          </p>
        </Link>
        <label
          htmlFor="toggle-switch"
          onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
        >
          <input
            type="checkbox"
            id="toggle-switch"
            className={`peer relative hidden h-8 w-14 cursor-pointer appearance-none items-center justify-evenly rounded-full border-2 bg-white bg-opacity-5 transition duration-200 checked:bg-gray-600 md:flex`}
            defaultChecked={resolvedTheme === 'light' ? false : true}
          />

          {/* <Image
            className=" absolute right-0 top-0"
            src={iconMoon}
            width={20}
            height={20}
          />
          <Image
            className=" absolute left-0 top-0"
            src={iconSun}
            width={20}
            height={20}
          /> */}
        </label>
      </div>
    </header>
  )
}

export default Header
