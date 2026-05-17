// File: /app/api/guides/route.js

import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio'; // Adjust path to your prismicio client
import { asText } from "@prismicio/client";
import * as prismic from "@prismicio/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'recent';
  const categories = searchParams.get('categories')?.split(',');
  const searchQuery = searchParams.get('q');

  const client = createClient();
  
  // 1. Define Orderings for the Prismic API query
  let orderings = { field: 'my.guide.date', direction: 'desc' }; // Default
  if (sort === 'title_asc') {
    orderings = { field: 'my.guide.title', direction: 'asc' };
  } else if (sort === 'title_desc') {
    orderings = { field: 'my.guide.title', direction: 'desc' };
  }

  // 2. Define Filters (Predicates) for the Prismic API query
  const predicates = [];
  
  // Filter by category tags if any are provided
  if (categories && categories.length > 0 && categories[0] !== '') {
      predicates.push(prismic.predicate.at('document.tags', categories));
  }
  
  // Add a full-text search predicate if a query is provided
  if (searchQuery) {
    predicates.push(prismic.predicate.fulltext('document', searchQuery));
  }
  
  try {
    const guidesResponse = await client.getAllByType("guide", {
      orderings,
      predicates,
      fetch: [
        'guide.title',
        'guide.image',
        'guide.author',
        'guide.date',
        'guide.guide'
      ]
    });

    // 3. Map the data as in the original server component
    const guides = guidesResponse.map(doc => {
      const excerpt = doc.data.guide ? asText(doc.data.guide).substring(0, 150) + '...' : 'No excerpt available.';

      return {
        id: doc.id,
        slug: doc.uid,
        title: doc.data.title,
        imageField: doc.data.image,
        category: doc.tags[0] || 'General',
        author: doc.data.author,
        date: doc.data.date,
        excerpt: excerpt,
      };
    });

    return NextResponse.json(guides);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch guides from Prismic' }, { status: 500 });
  }
}
