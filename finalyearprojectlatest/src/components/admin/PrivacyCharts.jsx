import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const PrivacyLineChart = ({ chartData }) => {
  const data = {
    labels: chartData.traffic?.labels?.length > 0 ? chartData.traffic.labels : ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Requests',
        data: chartData.traffic?.data?.length > 0 ? chartData.traffic.data : [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { display: false }, ticks: { display: false } },
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
    },
  };

  return <Line data={data} options={options} />;
};

export const SensitivityDoughnut = ({ chartData }) => {
  const data = {
    labels: chartData.sensitivity?.labels?.length > 0 ? chartData.sensitivity.labels : ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    datasets: [
      {
        data: chartData.sensitivity?.data?.length > 0 ? chartData.sensitivity.data : [0, 0, 0, 0],
        backgroundColor: [
          '#f1f5f9',
          '#38bdf8',
          '#f59e0b',
          '#f43f5e',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 8, padding: 15, font: { size: 10 } } },
    },
  };

  return <Doughnut data={data} options={options} />;
};

