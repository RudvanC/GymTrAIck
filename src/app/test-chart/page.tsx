// app/test-chart/page.tsx
"use client";

// Importaciones necesarias para Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Registramos los componentes del gráfico que vamos a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Los datos de prueba
const chartData = {
  labels: ["2025-06-19", "2025-06-20", "2025-06-21", "2025-06-22"],
  datasets: [
    {
      label: "Volumen Total (kg)",
      data: [240, 350, 280, 410],
      borderColor: "rgb(59, 130, 246)", // Un color azul
      backgroundColor: "rgba(59, 130, 246, 0.5)",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Gráfico de Prueba con Chart.js",
    },
  },
};

export default function TestChartPage() {
  return (
    <main className="bg-white min-h-screen p-10">
      <h1 className="text-slate-900 text-2xl mb-4">
        Página de Prueba con Chart.js
      </h1>
      <div style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
        <Line options={chartOptions} data={chartData} />
      </div>
    </main>
  );
}
