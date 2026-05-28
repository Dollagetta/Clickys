'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Safely log error without circular structures
    if (error) {
      console.error('App Error:', error.message || error);
      if (error.stack) console.error(error.stack);
    }
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
