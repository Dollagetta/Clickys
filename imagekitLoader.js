export default function imageKitLoader({ src, width, quality }) {
  if (!src) return '';

  // Safe Fallback: If src is already a full external URL (including protocol-relative), 
  // return it directly to prevent broken images unless it is an ImageKit URL itself.
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
    // If it's already an ImageKit URL, we can still apply transformations
    if (src.includes('imagekit.io')) {
      const params = [`w-${width}`];
      if (quality) {
        params.push(`q-${quality}`);
      }
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}tr=${params.join(",")}`;
    }
    // Return external URLs as-is to avoid breaking them by appending to ImageKit endpoint
    return src;
  }

  let path = src;
  if (path && path[0] === "/") path = path.slice(1);
  
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  
  let urlEndpoint = "https://ik.imagekit.io/Dollagetta";
  if (urlEndpoint[urlEndpoint.length - 1] === "/") {
    urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  }
  
  // If the path is empty (after slicing /), just return the endpoint or a placeholder
  if (!path) return urlEndpoint;

  // If the original URL already has query parameters, append with &
  const separator = path.includes('?') ? '&' : '?';
  
  return `${urlEndpoint}/${path}${separator}tr=${paramsString}`;
}
