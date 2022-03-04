declare global {
  interface Window {
    gtag: any
  }
}

export const pageview = (url: string) => {
  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
    path_url: url,
  })
}
