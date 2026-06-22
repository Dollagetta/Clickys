export default function imageKitLoader({ src, width, quality }) {
  const originalSrc = src;
  if(src[0] === "/") src = src.slice(1);
  
  if (originalSrc.startsWith('http://') || originalSrc.startsWith('https://')) {
    return originalSrc;
  }
  if (originalSrc.startsWith('/_next/')) {
    return originalSrc;
  }

  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  let urlEndpoint = "https://ik.imagekit.io/Dollagetta";
  if(urlEndpoint[urlEndpoint.length-1] === "/") urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  
  return `${urlEndpoint}/${src}?tr=${paramsString}`;
}
