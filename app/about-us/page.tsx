import { Suspense } from 'react';
import { PageRenderer } from '@/components/PageRenderer';
import { loadPageSections } from '@/lib/loadPageSections';

export const dynamic = 'force-dynamic'; // 👈 disables caching

async function AboutUsPage() {
  const slist = ['header', 'hero', 'about', 'footer'];
  const sections = await loadPageSections('about-us', slist);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <PageRenderer page="about-us" sections={sections} />
      </Suspense>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutUsPage />
    </Suspense>
  );
}