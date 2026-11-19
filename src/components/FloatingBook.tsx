import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookButton } from './BookButton'

/** Sticky highlighted CTA: appears after the hero, hides near the contact section. */
export function FloatingBook() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const check = () => {
      const c = document.getElementById('contact')
      const nearContact = c ? c.getBoundingClientRect().top < window.innerHeight * 0.6 : false
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearContact)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8"
        >
          <BookButton small label="Book a client project" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
