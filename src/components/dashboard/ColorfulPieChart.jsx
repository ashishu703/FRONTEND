import React, { useMemo } from 'react';

const ColorfulPieChart = ({ data, title, total, allData: allDataProp, size = 200 }) => {
  const radius = size / 2 - 20;
  const center = size / 2;

  // Filter segments for pie chart (only show non-zero values in chart)
  // Data is already filtered before passing to component (like Total Leads Distribution)
  const segments = useMemo(() => data.filter(item => (item.value || 0) > 0), [data]);
  
  // For legend, use allData prop if provided (includes zeros), otherwise use segments
  const allData = useMemo(() => {
    if (allDataProp && Array.isArray(allDataProp)) {
      return allDataProp.filter(item => item.value !== null && item.value !== undefined);
    }
    return segments;
  }, [allDataProp, segments]);

  const paths = useMemo(() => {
    if (segments.length === 0) return [];
    
    // Use original total if provided, otherwise calculate from segments
    const segmentTotal = segments.reduce((sum, item) => sum + (item.value || 0), 0);
    const effectiveTotal = total > 0 ? total : segmentTotal;
    
    if (effectiveTotal === 0) return [];
    
    // If only one segment and it's 100%, make it a full circle
    if (segments.length === 1 && segmentTotal === effectiveTotal) {
      const item = segments[0];
      const centerX = center;
      const centerY = center;
      
      // Full circle path - draw complete 360 degree circle
      // Start from top, draw two arcs to complete the circle
      const topY = centerY - radius;
      const bottomY = centerY + radius;
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${centerX} ${topY}`,
        `A ${radius} ${radius} 0 1 1 ${centerX} ${bottomY}`,
        `A ${radius} ${radius} 0 1 1 ${centerX} ${topY}`,
        'Z'
      ].join(' ');
      
      return [{ pathData, color: item.color, label: item.label, value: item.value }];
    }
    
    let cumulativePercentage = 0;
    const result = segments.map((item) => {
      const itemValue = item.value || 0;
      const percentage = effectiveTotal > 0 ? (itemValue / effectiveTotal) * 100 : 0;
      const startAngle = (cumulativePercentage / 100) * 360;
      const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
      cumulativePercentage += percentage;

      const centerX = center;
      const centerY = center;

      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);

      const largeArcFlag = percentage > 50 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      return { pathData, color: item.color, label: item.label, value: item.value };
    });
    
    return result;
  }, [segments, total, radius, center]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="flex items-center justify-center h-64">
        {paths.length > 0 ? (
          <div className="relative" style={{ width: size, height: size }}>
            <svg 
              width={size} 
              height={size} 
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
            >
              {paths.map((path, index) => (
                <path
                  key={index}
                  d={path.pathData}
                  fill={path.color}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{(total > 0 ? total : segments.reduce((sum, item) => sum + (item.value || 0), 0)).toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No data available</div>
        )}
      </div>
      {allData.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {allData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-gray-600">{item.label} ({item.value || 0})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorfulPieChart;

