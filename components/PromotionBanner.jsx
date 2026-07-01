// components/PromotionBanner.jsx
"use client";

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { motion } from 'framer-motion';
import styles from '../styles/PromotionBanner.module.css';

const PromotionBanner = ({ slice }) => {
  const { image, title, short_paragraph, link, offer, video } = slice.data;
  
  const buttonText = link.text || 'Explore Now';

  const getEmbedHtml = (videoData) => {
    const data = Array.isArray(videoData) ? videoData[0] : videoData;
    
    // rel=0: show related videos from same channel
    // modestbranding=1: hide YouTube logo in the control bar
    // controls=1: enable player controls
    const params = "?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1&iv_load_policy=3";

    if (data?.html) {
      const flexibleHtml = data.html
        .replace(/width="\d+"/, 'width="100%"')
        .replace(/height="\d+"/, 'height="100%"')
        .replace('?', `${params}&`)
        .replace('style="', 'style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;');
      return { __html: flexibleHtml };
    }

    let url = typeof data === 'string' ? data : (data?.url || data?.embed_url || null);
    if (!url) return null;
    
    if (data?.link_type === 'Media' || url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.includes('prismic-io.s3.amazonaws.com')) {
      return { isVideoTag: true, url };
    }
    
    try {
      const u = new URL(url);
      let embedUrl = url;
      
      if (u.hostname.includes('youtube.com')) {
          if (u.pathname === '/watch' && u.searchParams.has('v')) {
              embedUrl = `https://www.youtube.com/embed/${u.searchParams.get('v')}${params}`;
          } else if (u.pathname.startsWith('/embed/')) {
              embedUrl = `${url}${params}`;
          }
      } else if (u.hostname.includes('youtu.be')) {
          const id = u.pathname.substring(1).split('/')[0];
          embedUrl = `https://www.youtube.com/embed/${id}${params}`;
      }
      
      return { 
        __html: `<iframe src="${embedUrl}" title="Banner Video" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>` 
      };
    } catch(e) {
      return { 
        __html: `<iframe src="${url}${params}" title="Banner Video" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowFullScreen></iframe>` 
      };
    }
  };

  const embedHtml = getEmbedHtml(video);

  return (
    <div className={styles.bannerWrapper}>
      {offer && (
        <div className={styles.offerStrip}>
          <div className={styles.offerText}>
            <span>{offer}</span><span>{offer}</span><span>{offer}</span><span>{offer}</span>
          </div>
        </div>
      )}

      <motion.section 
        className={styles.bannerContainer}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Column: Text Content */}
        <div className={styles.textColumn} style={{ backgroundColor: '#ffffff' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title && <h1 className={styles.title} style={{ color: '#0f0d0d' }}>{title}</h1>}
            {short_paragraph && <p className={styles.paragraph} style={{ color: '#110f0f' }}>{short_paragraph}</p>}
            <PrismicNextLink field={link} className={styles.bannerButton} style={{ backgroundColor: '#dc8928', color: '#ffffff' }}>
              {buttonText}
            </PrismicNextLink>
          </motion.div>
        </div>

        {/* Right Column: Visuals (Video/Image) */}
        <div className={styles.imageColumn} style={{ backgroundColor: '#ffffff' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full flex flex-col items-center justify-center gap-4"
          >
            {(image?.url || slice.data.image1?.url || slice.data.Image1?.url) && (
              <div className="flex w-full flex-row gap-4 items-center justify-center">
                {image?.url && (
                  <div className="flex-1 min-w-0">
                    <PrismicNextImage 
                      field={image} 
                      className={styles.bannerImage} 
                    />
                  </div>
                )}
                {(slice.data.image1?.url || slice.data.Image1?.url) && (
                  <div className="flex-1 min-w-0">
                    <PrismicNextImage 
                      field={slice.data.image1?.url ? slice.data.image1 : slice.data.Image1} 
                      className={styles.bannerImage} 
                    />
                  </div>
                )}
              </div>
            )}
            
            {embedHtml && embedHtml.isVideoTag ? (
              <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 group hover:shadow-cyan-500/20 transition-all duration-500">
                <video 
                  src={embedHtml.url}
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
            ) : embedHtml && (
              <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 group hover:shadow-cyan-500/20 transition-all duration-500">
                {/* 
                  Using scale-[1.35] ensures the 16:9 iframe matches the container's 16:9 ratio 
                  without letterboxing, while pushing the title and logo safely out of bounds.
                */}
                <div 
                  className="w-full h-full scale-[1.35] pointer-events-auto origin-center transition-transform duration-700 group-hover:scale-[1.40]"
                  dangerouslySetInnerHTML={{
                    __html: embedHtml.__html.replace('controls=0', 'controls=1').replace('mute=1', 'mute=0')
                  }}
                />
                
                {/* Modern aesthetic overlays and Interaction Shields removed to allow video interaction */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10" />
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default PromotionBanner;