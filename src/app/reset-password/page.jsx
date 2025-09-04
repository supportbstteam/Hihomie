import { Suspense } from 'react';
import ResetPassword from './RestePassword';



export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}