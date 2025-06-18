
import { Card } from '@/components/ui/card';

import AdCard from './ad-card';
import AdSkeletons from './ad-skeleton';
import { Ad } from '@/hooks/ad/schema';

const AdsDisplay = ({ ads, loading }:{
    ads: Ad[];
    loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdSkeletons count={6} />
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-lg font-medium">No ads found</p>
        <p className="text-muted-foreground">Create your first ad using the button above</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

export default AdsDisplay;