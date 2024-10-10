export function setCookie<T>(key: string, value: T, days: number | null) {
  let expires: string = '';
  const date: Date = new Date();
  if (days) {
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = key + '=' + (JSON.stringify(value) || '') + expires + '; path=/';
}
