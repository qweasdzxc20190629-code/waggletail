import { products } from '../../products';
import AdminDashboardClient from './AdminDashboardClient';

// Reads the server's own `products` array on every load so a second admin
// session/tab starts from the current state, not a build-time snapshot.
export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  return <AdminDashboardClient initialProducts={products} />;
}
