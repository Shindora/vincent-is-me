'use client';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [visitors, setVisitors] = useState(0);

  // Sample data - replace with real analytics data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Visitors',
        data: [150, 280, 390, 430, 580, 690],
        borderColor: '#00ff41', // Matrix green
        backgroundColor: 'rgba(0, 255, 65, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#ff00ff', // Cyber pink
        pointBorderColor: '#00ff41',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00ff41',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#00ff41'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(0, 255, 65, 0.1)',
        },
        ticks: {
          color: '#00ff41'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 255, 65, 0.1)',
        },
        ticks: {
          color: '#00ff41'
        }
      }
    }
  };

  return (
    <div className="min-h-screen p-8 pt-20 terminal-background">
      <h1 className="text-4xl font-bold mb-8 glitch-text">VISITOR_METRICS::/</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="terminal-window p-4">
          <h2 className="text-xl text-cyber-pink mb-4">Total Visitors</h2>
          <div className="text-4xl text-cyber-green">690</div>
        </div>
        <div className="terminal-window p-4">
          <h2 className="text-xl text-cyber-pink mb-4">Current Active</h2>
          <div className="text-4xl text-cyber-green">42</div>
        </div>
      </div>

      <div className="terminal-window p-6">
        <h2 className="text-xl text-cyber-pink mb-6">Traffic Analysis</h2>
        <div className="h-[400px] w-full">
          <Line data={chartData} options={options} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="terminal-window p-4">
          <h3 className="text-cyber-pink mb-2">Peak Hours</h3>
          <div className="text-cyber-green">14:00 - 18:00 UTC</div>
        </div>
        <div className="terminal-window p-4">
          <h3 className="text-cyber-pink mb-2">Top Location</h3>
          <div className="text-cyber-green">United States</div>
        </div>
        <div className="terminal-window p-4">
          <h3 className="text-cyber-pink mb-2">Growth Rate</h3>
          <div className="text-cyber-green">+18.7%</div>
        </div>
      </div>
    </div>
  );
}
