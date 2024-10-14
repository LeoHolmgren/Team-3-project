import { useState, useCallback } from "react"
import Cookies from "js-cookie"

export default function useCookie<T>(name: string, defaultValue: T) {
    
  const [value, setValue] = useState(() => {
    const cookie = Cookies.get(name)
    if (cookie) return cookie
    Cookies.set(name, JSON.stringify(defaultValue))
    return defaultValue
  })

  const updateCookie = useCallback(
    (newValue: T, options: Cookies.CookieAttributes) => {
      Cookies.set(name, JSON.stringify(newValue), options)
      setValue(newValue)
    },
    [name]
  )

  const deleteCookie = useCallback(() => {
    Cookies.remove(name)
    setValue(defaultValue)
  }, [name, defaultValue])

  return [value, updateCookie, deleteCookie]
}