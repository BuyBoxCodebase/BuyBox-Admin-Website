import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import PerformanceMetrics from "./ad-performance";
import { Ad } from "@/hooks/ad/schema";
import { Badge } from "@/components/ui/badge";

const AdCard = ({ ad }:{
    ad: Ad
}) => {
    // Format dates
    const startDate = ad.startDate ? formatDistanceToNow(new Date(ad.startDate), { addSuffix: true }) : 'Not set';
    
    // Get status color
    const getStatusColor = (status:Ad['status']) => {
      switch (status) {
        case 'ACTIVE': return 'bg-green-500';
        case 'PAUSED': return 'bg-yellow-500';
        case 'DRAFT': return 'bg-gray-500';
        case 'SCHEDULED': return 'bg-blue-500';
        case 'ENDED': return 'bg-red-500';
        case 'ARCHIVED': return 'bg-purple-500';
        default: return 'bg-gray-500';
      }
    };
    //console.log(ad.status)
    return (
      <Card className="w-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{ad.title}</CardTitle>
            <Badge className={`${getStatusColor(ad.status)} text-white`}>
              {ad.status}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{ad.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {ad.type && (
              <Badge variant="outline">{ad.type}</Badge>
            )}
            {ad.placement && (
              <Badge variant="outline">{ad.placement.replace(/_/g, ' ')}</Badge>
            )}
            {ad.targetType && (
              <Badge variant="outline">{ad.targetType.replace(/_/g, ' ')}</Badge>
            )}
          </div>
  
          {/* Associated items */}
          <div className="flex flex-col gap-1 text-sm">
            {ad.product && (
              <div>
                <span className="font-medium">Product:</span> {ad.product.name}
              </div>
            )}
            {ad.category && (
              <div>
                <span className="font-medium">Category:</span> {ad.category.name}
              </div>
            )}
            {ad.brand && (
              <div>
                <span className="font-medium">Brand:</span> {ad.brand.name}
              </div>
            )}
          </div>
  
          {/* Media preview */}
          {ad.mediaUrls && ad.mediaUrls.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {ad.mediaUrls.slice(0, 3).map((url, index) => (
                <img 
                  key={index} 
                  src={url} 
                  alt={`Ad media ${index + 1}`} 
                  className="h-20 w-20 rounded-md object-cover"
                />
              ))}
              {ad.mediaUrls.length > 3 && (
                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100">
                  +{ad.mediaUrls.length - 3}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t pt-4">
          <div className="flex w-full justify-between text-sm">
            <span>Started: {startDate}</span>
            <span>Priority: {ad.priority || 'Normal'}</span>
          </div>
          <PerformanceMetrics performance={ad.performance} />
        </CardFooter>
      </Card>
    );
  };

  export default AdCard;