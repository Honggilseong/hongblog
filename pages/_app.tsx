import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as ga from '../lib/google-analytics'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />

      <Script id="google-analytics-script" strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
