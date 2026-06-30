// File: /app/api/whats-new/route.js

import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio';
import { asText } from "@prismicio/client";
import * as prismic from "@prismicio/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'recent';
  const categories = searchParams.get('categories')?.split(',');
  const searchQuery = searchParams.get('q');

  const client = createClient();
  
  let orderings = { field: 'my.whatsnew.date', direction: 'desc' }; // Default
  if (sort === 'title_asc') {
    orderings = { field: 'my.whatsnew.title', direction: 'asc' };
  } else if (sort === 'title_desc') {
    orderings = { field: 'my.whatsnew.title', direction: 'desc' };
  }

  const predicates = [];
  
  if (categories && categories.length > 0 && categories[0] !== '') {
      predicates.push(prismic.predicate.at('document.tags', categories));
  }
  
  if (searchQuery) {
    predicates.push(prismic.predicate.fulltext('document', searchQuery));
  }
  
  try {
    const whatsnewResponse = await client.getAllByType("whatsnew", {
      orderings,
      predicates,
    });

    const items = whatsnewResponse.map(doc => {
      // Create a fallback excerpt from slices if no direct field exists
      let excerptText = 'No excerpt available.';
      if (doc.data.slices && doc.data.slices.length > 0) {
        const textSlice = doc.data.slices.find(s => s.slice_type === 'text' || s.primary?.description);
        if (textSlice && textSlice.primary?.description) {
           excerptText = asText(textSlice.primary.description).substring(0, 150) + '...';
        }
      }

      return {
        id: doc.id,
        slug: doc.uid,
        title: doc.data.title || doc.data.name || 'Untitled',
        imageField: doc.data.image || doc.data.hero_image || null,
        category: doc.tags[0] || 'General',
        author: doc.data.author || 'Admin',
        date: doc.data.date || doc.first_publication_date,
        excerpt: excerptText,
      };
    });

    return NextResponse.json(items);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch whatsnew from Prismic' }, { status: 500 });
  }
}
