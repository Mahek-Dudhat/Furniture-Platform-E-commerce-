import { useState, useEffect } from 'react'
import { FaLongArrowAltUp } from "react-icons/fa";
import './BackToTop.css'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener('scroll', toggleVisible)
    return () => window.removeEventListener('scroll', toggleVisible)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    visible && (
      <button onClick={scrollToTop}   className="back-to-top">
        <FaLongArrowAltUp />
      </button>
    )
  )
}

export default BackToTop
