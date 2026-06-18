import { Suspense } from 'react';
import MypageClient from './MypageClient';

export const dynamic = 'force-dynamic';

export default function MyPage() {
  return (
    <Suspense fallback={null}>
      <MypageClient />
    </Suspense>
  );
}
