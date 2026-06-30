"use client";
import { useState } from 'react';
import styles from '../../styles/ContactPage.module.css';

// FAQ Section as Client Component
function FAQSection({ data }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={styles.faqSection} data-aos="fade-up" data-aos-delay="200">
      <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
      <ul className={styles.faqList}>
        {data.map(({ id, question, answer }) => (
          <li key={id} className={styles.faqItem}>
            <button onClick={() => toggle(id)} className={styles.faqQuestion}>
              {question}
            </button>
            {openId === id && (
              <div className={styles.faqAnswer}>
                <p>{answer}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FAQSection;
