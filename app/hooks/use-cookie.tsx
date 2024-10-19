import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';

export default function useCookie<T>(
  name: string,
  defaultValue: T
): [T, (newValue: T, options?: Cookies.CookieAttributes) => void, () => void] {
  function getCookie(): T {
    const cookie = Cookies.get(name);
    if (cookie) return JSON.parse(cookie) as T;
    Cookies.set(name, JSON.stringify(defaultValue));
    return defaultValue;
  }

  const [cookie, updateCookieState] = useState<T>(getCookie());

  const setCookie = useCallback(
    (newValue: T, options?: Cookies.CookieAttributes) => {
      Cookies.set(name, JSON.stringify(newValue), options);
      updateCookieState(newValue);
    },
    [name]
  );

  const deleteCookie = useCallback(() => {
    Cookies.remove(name);
    updateCookieState(defaultValue);
  }, [name, defaultValue]);

  return [cookie, setCookie, deleteCookie];
}
