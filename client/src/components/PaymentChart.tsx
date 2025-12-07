import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PaymentChartProps {
  data?: Array<{
    month: string;
    payments: number;
    expected: number;
  }>;
}

const PaymentChart: React.FC<PaymentChartProps> = ({ data = [] }) => {
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    // { month: 'Jan', payments: 45000, expected: 50000 },
    { month: 'Feb', payments: 0, expected: 0 },
    { month: 'Mar', payments: 0, expected: 0 },
    { month: 'Apr', payments: 0, expected: 0 },
    { month: 'May', payments: 0, expected: 0 },
    { month: 'Jun', payments: 0, expected: 0 },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis 
              stroke="#64748b"
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Amount']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="expected" 
              fill="#cbd5e1" 
              name="Expected" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="payments" 
              fill="#64748b" 
              name="Received" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentChart;