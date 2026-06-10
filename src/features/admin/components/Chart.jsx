// src/features/admin/components/Chart.jsx

import { useEffect, useRef } from 'react';

const Chart = ({ data, type = 'line', height = 300, color = '#534AB7' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement?.clientWidth || 600;
    const heightValue = height;
    
    canvas.width = width;
    canvas.height = heightValue;

    ctx.clearRect(0, 0, width, heightValue);

    if (!data.labels?.length || !data.values?.length) return;

    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = heightValue - padding.top - padding.bottom;
    const maxValue = Math.max(...data.values, 1);
    const xStep = chartWidth / (data.values.length - 1);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, heightValue - padding.bottom);
    ctx.stroke();
    
    ctx.moveTo(padding.left, heightValue - padding.bottom);
    ctx.lineTo(width - padding.right, heightValue - padding.bottom);
    ctx.stroke();

    // Draw grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = heightValue - padding.bottom - (i / gridLines) * chartHeight;
      const value = (maxValue * i / gridLines).toFixed(0);
      
      ctx.beginPath();
      ctx.strokeStyle = '#F3F4F6';
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px sans-serif';
      ctx.fillText(value, 5, y + 3);
    }

    // Draw X-axis labels
    data.labels.forEach((label, i) => {
      const x = padding.left + i * xStep;
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px sans-serif';
      ctx.fillText(label, x - 15, heightValue - padding.bottom + 15);
    });

    // Draw data
    if (type === 'line') {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      data.values.forEach((value, i) => {
        const x = padding.left + i * xStep;
        const y = heightValue - padding.bottom - (value / maxValue) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points
      data.values.forEach((value, i) => {
        const x = padding.left + i * xStep;
        const y = heightValue - padding.bottom - (value / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

  }, [data, type, height, color]);

  if (!data?.labels?.length) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <canvas ref={canvasRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default Chart;