// NO 'use client' directive - this is a server component
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { FiExternalLink } from "react-icons/fi";
import styles from "../styles/GuideDetailPage.module.css";
import { CodeBlockWithCopy } from "./CodeBlockWithCopy";

export const RichTextComponents = {
  heading1: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/\s+/g, '-');
    return <h1 id={id} className={styles.richTextH1}>{children}</h1>;
  },
  heading2: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/\s+/g, '-');
    return <h2 id={id} className={styles.richTextH2}>{children}</h2>;
  },
  heading3: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/\s+/g, '-');
    return <h3 id={id} className={styles.richTextH3}>{children}</h3>;
  },
  heading4: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/\s+/g, '-');
    return <h4 id={id} className={styles.richTextH4}>{children}</h4>;
  },
  heading5: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/\s+/g, '-');
    return <h5 id={id} className={styles.richTextH5}>{children}</h5>;
  },
  heading6: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/\s+/g, '-');
    return <h6 id={id} className={styles.richTextH6}>{children}</h6>;
  },
  paragraph: ({ children }) => (
    <p className={styles.richTextParagraph}>{children}</p>
  ),
  preformatted: ({ children }) => {
    const text = children?.toString() || '';
    return <CodeBlockWithCopy code={text}>{children}</CodeBlockWithCopy>;
  },
  strong: ({ children }) => (
    <strong className={styles.richTextStrong}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className={styles.richTextEm}>{children}</em>
  ),
  listItem: ({ children }) => (
    <li className={styles.richTextListItem}>{children}</li>
  ),
  oListItem: ({ children }) => (
    <li className={styles.richTextOListItem}>{children}</li>
  ),
  list: ({ children }) => (
    <ul className={styles.richTextList}>{children}</ul>
  ),
  oList: ({ children }) => (
    <ol className={styles.richTextOList}>{children}</ol>
  ),
  image: ({ node }) => (
    <figure className={styles.richTextImageWrapper}>
      <PrismicNextImage 
        field={node} 
        className={styles.richTextImage}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75ch"
      />
      {node.alt && (
        <figcaption className={styles.richTextImageCaption}>
          {node.alt}
        </figcaption>
      )}
    </figure>
  ),
  embed: ({ node }) => (
  <div className={styles.richTextEmbed}>
    {node?.oembed?.html ? (
      <div dangerouslySetInnerHTML={{ __html: node.oembed.html }} />
    ) : (
      <p>Embed unavailable</p>
    )}
  </div>
  ),
/*
  embed: ({ node }) => (
    <div className={styles.richTextEmbed}>
      <div dangerouslySetInnerHTML={{ __html: node.oembed.html }} />
    </div>
  ),*/
  hyperlink: ({ node, children }) => (
    <PrismicNextLink 
      field={node.data} 
      className={styles.richTextLink}
      target={node.data.target || '_self'}
    >
      {children}
      {node.data.target === '_blank' && <FiExternalLink className={styles.externalLinkIcon} />}
    </PrismicNextLink>
  ),
  label: ({ node, children }) => {
    const labelClass = styles[`richTextLabel${node.data.label}`] || styles.richTextLabel;
    return <span className={labelClass}>{children}</span>;
  },
};
