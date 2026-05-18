import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // prevents smooth scrolling animation on route change to avoid page-load layout flickers
    })
  }, [pathname])

  return null
}

export default ScrollToTop
