import { Suspense } from 'react';
import { PageRenderer } from '@/components/PageRenderer';
import { loadPageSections } from '@/lib/loadPageSections';
import Loading from '@/components/common/loading';

export const dynamic = 'force-dynamic'; // 👈 disables caching

async function HomePage() {
  const slist = ['header', 'hero', 'content', 'footer'];
  const sections = await loadPageSections('privacy-policy', slist);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <PageRenderer page="privacy-policy" sections={sections} />
      </Suspense>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePage />
    </Suspense>
  );
}