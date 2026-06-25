export default function imageKitLoader({ src, width, quality }) {
  // Safe Fallback: If src is already a full external URL, return it directly to prevent broken images
  // unless it is an ImageKit URL itself.
  if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
    if (src.includes('imagekit.io')) {
      const params = [`w-${width}`];
      if (quality) {
        params.push(`q-${quality}`);
      }
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}tr=${params.join(",")}`;
    }
    return src;
  }

  let path = src;
  if(path && path[0] === "/") path = path.slice(1);
  
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  
  let urlEndpoint = "https://ik.imagekit.io/Dollagetta";
  if(urlEndpoint[urlEndpoint.length-1] === "/") urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  
  // If the original URL already has query parameters (like ?id=...), append with &
  const separator = path && path.includes('?') ? '&' : '?';
  
  return `${urlEndpoint}/${path}${separator}tr=${paramsString}`;
}
