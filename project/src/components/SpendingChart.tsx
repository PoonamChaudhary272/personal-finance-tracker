import React, { useEffect, useRef } from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/storage';

interface SpendingChartProps {
  transactions: Transaction[];
}

interface CategoryData {
  category: string;
  amount: number;
  color: string;
  percentage: number;
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

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
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
  
  // Calculate total expenses and percentages
  const totalExpenses = categoriesData.reduce((sum, item) => sum + item.amount, 0);
  categoriesData.forEach(item => {
    item.percentage = totalExpenses ? (item.amount / totalExpenses) * 100 : 0;
  });
  
  // Draw the doughnut chart
  useEffect(() => {
    if (!canvasRef.current || categoriesData.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    // Get the actual CSS size
    const rect = canvas.getBoundingClientRect();
    
    // Set the canvas dimensions accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale the context to match the DPR
    ctx.scale(dpr, dpr);
    
    // Set the canvas styles to match the CSS size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = radius * 0.6; // For doughnut hole
    
    let startAngle = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each segment
    categoriesData.forEach(item => {
      const endAngle = startAngle + (item.percentage / 100) * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw inner circle for doughnut effect
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.closePath();
      
      ctx.fillStyle = 'white';
      ctx.fill();
      
      startAngle = endAngle;
    });
    
    // If there's no data, draw a placeholder
    if (categoriesData.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#E2E8F0'; // gray-200
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      
      ctx.fillStyle = '#A0AEC0'; // gray-400
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No expenses yet', centerX, centerY);
    }
  }, [transactions, categoriesData]);
  
  // If no expenses, show a message
  if (totalExpenses === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No expenses recorded for this period
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="w-full md:w-1/2 h-64">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
      
      <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6">
        <div className="max-h-64 overflow-y-auto">
          {categoriesData.map((item) => (
            <div key={item.category} className="flex items-center mb-3">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: item.color }}
              ></div>
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

export default SpendingChart;