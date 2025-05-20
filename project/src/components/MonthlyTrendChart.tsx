import React, { useEffect, useRef } from 'react';
import { Transaction } from '../types';
import { getMonthYear } from '../utils/storage';

interface MonthlyTrendChartProps {
  transactions: Transaction[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ transactions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Group transactions by month
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = getMonthYear(transaction.date);
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    // Convert to arrays and sort by date
    const months = Object.keys(monthlyData).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const incomeData = months.map(month => monthlyData[month].income);
    const expenseData = months.map(month => monthlyData[month].expense);

    // Find max value for scaling
    const maxValue = Math.max(
      ...incomeData,
      ...expenseData
    );

    // Chart dimensions
    const padding = 40;
    const width = rect.width - padding * 2;
    const height = rect.height - padding * 2;
    const pointSpacing = width / (months.length - 1);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#E2E8F0';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height + padding);
    ctx.lineTo(width + padding, height + padding);
    ctx.stroke();

    // Draw grid lines
    const gridLines = 5;
    ctx.textAlign = 'right';
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#718096';
    
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (height * i) / gridLines;
      const value = ((gridLines - i) * maxValue) / gridLines;
      
      ctx.beginPath();
      ctx.strokeStyle = '#EDF2F7';
      ctx.moveTo(padding, y);
      ctx.lineTo(width + padding, y);
      ctx.stroke();
      
      ctx.fillText(
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
          notation: 'compact',
        }).format(value),
        padding - 5,
        y + 4
      );
    }

    // Draw month labels
    ctx.textAlign = 'center';
    months.forEach((month, i) => {
      const x = padding + i * pointSpacing;
      ctx.fillText(
        month.split(' ')[0].substring(0, 3),
        x,
        height + padding + 20
      );
    });

    // Draw lines
    const drawLine = (data: number[], color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      data.forEach((value, i) => {
        const x = padding + i * pointSpacing;
        const y = padding + height - (value / maxValue) * height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw points
      data.forEach((value, i) => {
        const x = padding + i * pointSpacing;
        const y = padding + height - (value / maxValue) * height;
        
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawLine(incomeData, '#38A169'); // Green for income
    drawLine(expenseData, '#E53E3E'); // Red for expenses

    // Draw legend
    const legendY = padding - 15;
    const legendSpacing = 100;
    
    // Income legend
    ctx.beginPath();
    ctx.fillStyle = '#38A169';
    ctx.arc(padding, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#4A5568';
    ctx.textAlign = 'left';
    ctx.fillText('Income', padding + 10, legendY + 4);
    
    // Expense legend
    ctx.beginPath();
    ctx.fillStyle = '#E53E3E';
    ctx.arc(padding + legendSpacing, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#4A5568';
    ctx.fillText('Expenses', padding + legendSpacing + 10, legendY + 4);

  }, [transactions]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64"
    />
  );
};

export default MonthlyTrendChart;