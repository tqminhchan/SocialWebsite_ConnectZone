import {useState, useEffect} from 'react'

const useDebouned = (text, delay) => {
  const [value, setValue] = useState(text)

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(text)
    }, delay)
    return () => clearTimeout(handler)
  }, [text])
  return value
}
export default useDebouned
