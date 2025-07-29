import { Suspense } from 'react';
import { PageRenderer } from '@/components/PageRenderer';
import { loadPageSections } from '@/lib/loadPageSections';

async function HomePage() {
  const slist = ['header', 'hero', 'banner', 'trust', 'cta', 'service', 'testominal', 'faq', 'footer'];
  const sections = await loadPageSections('hearing-loss', slist);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <PageRenderer page="hearing-loss" sections={sections} />
      </Suspense>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}