import {useState, useEffect, useRef} from 'react'

function useHover({onMouseEnter, onMouseLeave}) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
    onMouseEnter && onMouseEnter()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onMouseLeave && onMouseLeave()
  }

  useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)
      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [ref])

  return [ref, isHovered]
}

export default useHover
