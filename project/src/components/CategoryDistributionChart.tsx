import React, { useEffect, useRef } from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/storage';

interface CategoryDistributionChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#38A169', // green-600
  '#3182CE', // blue-600
  '#D69E2E', // yellow-600
  '#DD6B20', // orange-600
  '#E53E3E', // red-600
  '#805AD5', // purple-600
  '#319795', // teal-600
  '#B83280', // pink-600
  '#2C5282', // blue-800
  '#744210', // yellow-900
  '#9B2C2C', // red-900
  '#553C9A', // purple-800
];

interface CategoryData {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ transactions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filter expenses and group by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {} as Record<string, number>);

  // Convert to array and sort
  const categoriesData: CategoryData[] = Object.entries(expensesByCategory)
    .map(([category, amount], index) => ({
      category,
      amount,
      color: COLORS[index % COLORS.length],
      percentage: 0, // Will be calculated below
    }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate total and percentages
  const total = categoriesData.reduce((sum, item) => sum + item.amount, 0);
  categoriesData.forEach(item => {
    item.percentage = (item.amount / total) * 100;
  });

  useEffect(() => {
    if (!canvasRef.current || categoriesData.length === 0) return;

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

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    let startAngle = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    categoriesData.forEach(item => {
      const endAngle = startAngle + (item.percentage / 100) * Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      startAngle = endAngle;
    });

    // Draw center circle for donut effect
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw total in center
    ctx.fillStyle = '#2D3748';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Total Expenses', centerX, centerY - 10);
    ctx.fillText(formatCurrency(total), centerX, centerY + 10);

  }, [transactions, categoriesData, total]);

  if (categoriesData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No expenses recorded for this period
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="w-full md:w-1/2 h-64">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6">
        <div className="max-h-64 overflow-y-auto">
          {categoriesData.map((item) => (
            <div key={item.category} className="flex items-center mb-3">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span>{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;