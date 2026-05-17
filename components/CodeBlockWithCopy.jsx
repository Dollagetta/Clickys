'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from "react-icons/fi";
import styles from "../styles/GuideDetailPage.module.css";
import toast from 'react-hot-toast';

export function CodeBlockWithCopy({ code, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <button className={styles.copyCodeBtn} onClick={handleCopy}>
        {copied ? <FiCheck /> : <FiCopy />}
        {copied && <span>Copied!</span>}
      </button>
      <pre className={styles.richTextPre}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
