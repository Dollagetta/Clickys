import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "../../../prismicio";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify Prismic Webhook Secret securely
    const PRISMIC_SECRET = 'Dollagetta#2003';
    if (body.secret?.trim() !== PRISMIC_SECRET) {
      console.warn('Unauthorized revalidation webhook attempt');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (body.type === 'test-trigger') {
      return NextResponse.json({ message: 'Test successful.' }, { status: 200 });
    }

    // Always revalidate the general prismic tag cache
    // In next@16, revalidateTag expects a second argument for CacheLifeConfig
    revalidateTag("prismic", "default");

    // Also specifically revalidate specific pages if documents are present
    if (body.documents && body.documents.length > 0) {
      const client = createClient();
      try {
        const updatedDocs = await client.getAllByIDs(body.documents);
        
        updatedDocs.forEach((doc: any) => {
          if (doc.type === 'product') {
            // Provide specific path revalidation for products
            const slug = doc.uid || doc.data?.title?.toLowerCase().replace(/\s+/g, '-');
            revalidatePath(`/products/${slug}`);
          }
        });
        
        // Always revalidate the main areas that list products
        revalidatePath('/products');
        revalidatePath('/');
        revalidatePath('/deals');
        revalidatePath('/whats-new');
        
      } catch (err) {
        console.error('Error finding docs for revalidation:', err);
      }
    } else {
      // Fallback: revalidate everything under products if we don't know what changed
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error('Error handling revalidation:', error);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
