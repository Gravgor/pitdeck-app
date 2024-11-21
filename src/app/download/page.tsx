import { DownloadPage } from '@/components/download/DownloadPage';
import { WaitlistPage } from '@/components/download/WaitlistPage';

export default function Download() {
  // You can toggle this based on your needs
  const isPreRelease = true;
  
  return <WaitlistPage />;
} 