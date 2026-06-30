'use client';
import { useState } from 'react';
import styles from '../../../styles/ProductDetailPage.module.css'; // Create this CSS Module
import { FiCheckSquare, FiFeather } from 'react-icons/fi'; // Importing an icon for features

const MoreInfo = ({product}) => {
    const [activeTab, setActiveTab] = useState('description');
    return (
            <div className={styles.productDetailsTabs} data-aos="fade-up">
              {/* Basic Tab Structure (for a real tab system, use a Client Component) */}
              <div className={styles.tabNav}>
                  <button className={`${styles.tabButton} ${activeTab === 'description' ? styles.activeTab : ''}`} onClick={() => setActiveTab('description')}>Description</button>
                  {product.features && <button className={`${styles.tabButton} ${activeTab === 'features' ? styles.activeTab : ''}`} onClick={() => setActiveTab('features')}>Features</button>}
                  {product.specs && <button className={`${styles.tabButton} ${activeTab === 'specifications' ? styles.activeTab : ''}`} onClick={() => setActiveTab('specifications')}>Specifications</button>}
                  <button className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTab : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({product.reviewCount})</button>
              </div>

              <div className={styles.tabContent}>
                  {activeTab === 'description' && (
                    <div className={styles.tabPanel} dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                  )}

                  {activeTab === 'features' && product.features && (
                      <div className={styles.tabPanel}>
                          <ul className={styles.featuresList}>
                              {product.features.map((feature, index) => (
                                  <li key={index}><FiCheckSquare className={styles.featureIcon} /> {feature}</li>
                              ))}
                          </ul>
                      </div>
                  )}
                  
                  {activeTab === 'specifications' && product.specs && (
                      <div className={styles.tabPanel}>
                          <ul className={styles.featuresList}>
                              {Object.entries(product.specs).map(([key, value]) => (
                                  <li key={key}><FiFeather className={styles.featureIcon} /><strong>{key}:</strong> {value}</li>
                              ))}
                          </ul>
                      </div>
                  )}

                  {activeTab === 'reviews' && (
                        <div className={styles.tabPanel}>
                            <p>Reviews are not available for this product yet.</p>
                        </div>
                  )}
              </div>
            </div>
                )
}

export default MoreInfo
