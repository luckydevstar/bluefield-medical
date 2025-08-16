import { Suspense } from 'react';
import { PageRenderer } from '@/components/PageRenderer';
import { loadPageSections } from '@/lib/loadPageSections';
import Loading from '@/components/common/loading';

export const dynamic = 'force-dynamic'; // 👈 disables caching

async function HomePage() {
  const slist = ['header', 'hero', 'banner', 'step', 'know', 'service', 'testominal', 'faq', 'footer'];
  const sections = await loadPageSections('hearing-tests', slist);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <PageRenderer page="hearing-tests" sections={sections} />
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