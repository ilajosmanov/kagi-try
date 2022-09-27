export function faviconUrl(domain) {
  return `
    background-image: url(https://logo.clearbit.com/${domain}),
    url(${new URL("../../assets/favicon-fallback.svg", import.meta.url).href})`
}
