import { Ad } from "@/hooks/ad/schema";

const PerformanceMetrics = ({ performance }:{
    performance: Ad['performance']
}) => {
  if (!performance) return null;
  
  const { summary } = performance;
  
  return (
    <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
      <div className="flex flex-col">
        <span className="text-muted-foreground">Impressions</span>
        <span className="font-semibold">{summary.totalImpressions?.toLocaleString() || 0}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground">Clicks</span>
        <span className="font-semibold">{summary.totalClicks?.toLocaleString() || 0}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground">CTR</span>
        <span className="font-semibold">{(summary.overallCTR || 0).toFixed(2)}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground">ROI</span>
        <span className="font-semibold">{summary.roi ? `${summary.roi.toFixed(2)}%` : 'N/A'}</span>
      </div>
    </div>
  );
};

export default PerformanceMetrics;