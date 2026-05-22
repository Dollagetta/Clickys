"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiLoader, FiTerminal, FiShoppingCart, FiAlertCircle, FiImage, FiMic, FiX } from 'react-icons/fi';
import styles from '../styles/AIShopper.module.css';
import { createClient } from '../prismicio';
import * as prismic from '@prismicio/client';

import ProductCard from './ProductCard';

const systemInstruction = `You are an AI Personal Shopper for the website "Clickys".
Your goal is to recommend products to users based on their requests.
Search for products exclusively available in India on Indian stores (like Amazon.in, Flipkart, Myntra, etc.).
Pricing MUST be in INR (₹).

You MUST return your recommendations in a strict JSON format. 
DO NOT include any conversational filler outside the JSON.

JSON Structure:
{
  "products": [
    {
      "name": "Product Name",
      "price": "₹1,299",
      "rating": 4.5,
      "link": "URL to the product page",
      "imageUrl": "Direct high-quality image URL (use Google Search Google Images). MUST NOT BE EMPTY.",
      "description": "Brief description"
    }
  ]
}

Rules:
1. Provide product links. If Amazon India, use 'tag=dollagetta-21'.
2. Identify the absolute best options available right now using Google Search in India.
3. For imageUrl, you MUST extract a working, direct image URL from the search results or the product page. Do NOT leave it empty.
4. Ensure the JSON is perfectly formatted.`;

export default function AIShopperClient() {
  const [query, setQuery] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [imageMimeType, setImageMimeType] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'What are you looking for?', type: 'text' }
  ]);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImageBase64('');
    setImageMimeType('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() && !imageBase64) return;

    const userQuery = query.trim();
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery, image: imageFile ? URL.createObjectURL(imageFile) : null, type: 'text' }]);
    setIsLoading(true);

    const currentImageBase64 = imageBase64;
    const currentMimeType = imageMimeType;
    removeImage();

    try {
      const response = await fetch('/api/ai-shopper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery,
          imageBase64: currentImageBase64,
          imageMimeType: currentMimeType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recommendations');
      }

      const { data } = await response.json();
      
      // Ensure data is structured correctly as an array of products
      const productsArray = Array.isArray(data) ? data : data.products || [];

      setMessages(prev => [...prev, { role: 'model', data: { products: productsArray }, type: 'products' }]);

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      
      // Fallback to internal search (Prismic) if the AI API fails (e.g. quota exhausted)
      try {
        const client = createClient();
        const predicates = [prismic.predicate.at('document.type', 'product')];
        
        // Simple tokenization of user query to find keywords
        const keywords = userQuery.split(' ').filter(w => w.length > 3).join(' ');
        if (keywords) {
           predicates.push(prismic.predicate.fulltext('my.product.title', keywords));
        }

        const prismicRes = await client.getAllByType('product', { 
          predicates,
          orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
        });

        if (prismicRes && prismicRes.length > 0) {
          const prismicProducts = prismicRes.map((p, index) => ({
              id: p.id || `fallback-${index}`,
              name: p.data.title,
              category: p.data.category || 'General',
              price: p.data.price,
              imageUrl: p.data.image,
              link: p.data.link?.url || '#',
              platform: p.data.platform || 'Our Catalog',
              rating: 4.0, 
              description: "Found in our local catalog as AI search is currently unavailable."
          })).slice(0, 4);

          setMessages(prev => [...prev, { 
            role: 'model', 
            text: "My AI features are currently cooling down, but I found these matching items in our store:",
            type: 'text'
          }, {
            role: 'model',
            data: { products: prismicProducts },
            type: 'products'
          }]);
          setIsLoading(false);
          return;
        }
      } catch (fallbackErr) {
        console.error("Prismic fallback also failed", fallbackErr);
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Oops! I ran into an error while searching for products, and could not find anything in our internal catalog.',
        type: 'text'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.shopperContainer}>
      <div className={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.userWrapper : styles.modelWrapper}`}>
            {msg.role === 'model' && (
              <div className={styles.avatar}><FiShoppingCart className="text-orange-500" size={20} /></div>
            )}
            <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userBubble : styles.modelBubble}`}>
                {msg.type === 'text' ? (
                 <div>
                   {msg.image && (
                     <img src={msg.image} alt="User Upload" className="w-48 h-auto object-cover rounded-lg mb-2" />
                   )}
                   <p>{msg.text}</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 lg:gap-4">
                  {msg.data.products.map((product, pIdx) => (
                    <ProductCard key={pIdx} product={{
                      ...product,
                      amazonLink: product.link,
                      id: `ai-${pIdx}-${Date.now()}`
                    }} />
                  ))}
                 </div>
               )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.modelWrapper}`}>
            <div className={styles.avatar}><FiShoppingCart className="text-orange-500" size={20} /></div>
            <div className={`${styles.messageBubble} ${styles.modelBubble} ${styles.loadingBubble}`}>
              <FiLoader className={styles.spinner} />
              <span>Searching the web for the best recommendations...</span>
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4 ml-14">
            <button 
              onClick={() => setQuery("Can you help me find a gift?")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors border border-gray-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Find a gift
            </button>
            <button 
              onClick={() => setQuery("Best noise-canceling headphones")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors border border-gray-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
              Best headphones
            </button>
            <button 
              onClick={() => setQuery("Gifts under ₹2000")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors border border-gray-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Gifts under ₹2000
            </button>
            <button 
              onClick={() => setQuery("Compare iPhone 15 and Galaxy S24")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors border border-gray-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              Compare products
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        {imageFile && (
          <div className="relative inline-block mb-3 ml-4">
            <img src={URL.createObjectURL(imageFile)} alt="Upload Preview" className="w-16 h-16 object-cover rounded-md border border-gray-300" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              title="Remove image"
            >
              <FiX size={12} />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-orange-500 transition-colors"
            title="Upload an image"
            disabled={isLoading}
          >
            <FiImage size={24} />
          </button>
          <button 
             type="button"
             onClick={startListening}
             disabled={isLoading || isListening}
             className={`p-3 mr-2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-orange-500'}`}
             title="Use voice input"
          >
            <FiMic size={24} />
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., What are the best noise-canceling headphones?"
            className={styles.searchInput}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || (!query.trim() && !imageBase64)} className={styles.searchButton}>
            <FiSend size={20} />
            <span className="sr-only">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
