import { Suspense } from 'react';
import { PageRenderer } from '@/components/PageRenderer';
import { loadPageSections } from '@/lib/loadPageSections';

async function HomePage() {
  const slist = ['header', 'hero', 'footer'];
  const sections = await loadPageSections('home', slist);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <PageRenderer page="home" sections={sections} />
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