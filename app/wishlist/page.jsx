'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/Wishlist.module.css';
import { useWishlist } from '../../components/WishlistContext';
import ProductCard from '../../components/ProductCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import AnimatedPageWrapper from '../../components/AnimatedPageWrapper';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <AnimatedPageWrapper>
      <Navbar />
      <main className={styles.wishlistPage}>
        <div className="container">
          <header className={styles.header}>
            <div className={styles.titleWrapper}>
              <FiHeart className={styles.titleIcon} />
              <h1 className={styles.title}>My Wishlist</h1>
            </div>
            <p className={styles.subtitle}>
              {wishlist.length > 0 
                ? `You have ${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved for later.`
                : "Your wishlist is currently empty."}
            </p>
          </header>

          {wishlist.length > 0 ? (
            <div className={styles.productGrid}>
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <FiShoppingBag className={styles.emptyIcon} />
              </div>
              <h3>Nothing here yet</h3>
              <p>Explore our best deals and save your favorites to view them later.</p>
              <Link href="/products" className={styles.exploreButton}>
                Explore Featured Products
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </AnimatedPageWrapper>
  );
}
