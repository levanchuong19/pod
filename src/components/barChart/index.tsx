import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  data: number[];
}

const BarChart: React.FC<BarChartProps> = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "", //so lan duoc dat
        data,
        backgroundColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
