"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WorkoutData {
  workout_completed_at: string;
  total_volume: number;
}

export function ChartComponent({ data }: { data: WorkoutData[] }) {
  const chartData = {
    labels: data.map((item) =>
      new Date(item.workout_completed_at).toLocaleString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Volumen por Sesión (kg)",
        data: data.map((item) => item.total_volume),
        borderColor: "#22d3ee",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(34, 211, 238, 0.3)");
          gradient.addColorStop(1, "rgba(34, 211, 238, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#22d3ee",
        pointBorderColor: "#fff",
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#22d3ee",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#94a3b8",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Evolución del Volumen por Sesión",
        color: "#ffffff",
        font: {
          size: 18,
          // --- AQUÍ ESTÁ LA CORRECCIÓN ---
          weight: "bold" as const, // Añadimos 'as const' para satisfacer a TypeScript
          // -----------------------------
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#334155",
        },
        ticks: {
          color: "#94a3b8",
        },
      },
      x: {
        grid: {
          color: "#334155",
        },
        ticks: {
          color: "#94a3b8",
        },
      },
    },
  };

  return (
    <div className="w-full h-96 bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 shadow-lg rounded-xl p-4 sm:p-6">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}
