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
  // --- Importación clave para gráficos de radar ---
  RadialLinearScale,
} from "chart.js";
import { Radar } from "react-chartjs-2"; // Importamos Radar en lugar de Line

// Registramos todos los componentes necesarios, incluyendo RadialLinearScale
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale, // <-- Registramos la escala radial
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MuscleData {
  muscle_group: string;
  sets_count: number;
}

export function MuscleRadarChart({ data }: { data: MuscleData[] }) {
  // 1. Adaptamos los datos al formato que Chart.js necesita para el radar
  const chartData = {
    labels: data.map(
      (item) =>
        item.muscle_group.charAt(0).toUpperCase() + item.muscle_group.slice(1)
    ), // Los músculos serán las etiquetas
    datasets: [
      {
        label: "Series Completadas",
        data: data.map((item) => item.sets_count), // El conteo son los valores
        // --- ESTILOS DEL RADAR ---
        borderColor: "#22d3ee", // Cian-400 para la línea exterior
        backgroundColor: "rgba(34, 211, 238, 0.2)", // Relleno cian semi-transparente
        pointBackgroundColor: "#22d3ee",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#22d3ee",
      },
    ],
  };

  // 2. Opciones de personalización con el estilo de tu app
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#94a3b8", // slate-400
        },
      },
      title: {
        display: false, // En un radar, a veces el título estorba. Lo ponemos en la página.
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
    // --- ESTILOS DE LOS EJES DEL RADAR ---
    scales: {
      r: {
        // 'r' es la escala radial (los valores que van del centro hacia afuera)
        grid: {
          color: "#334155", // Líneas de la telaraña (slate-700)
        },
        angleLines: {
          color: "#334155", // Líneas que van del centro a los vértices
        },
        ticks: {
          display: false, // Ocultamos los números del eje para un look más limpio
        },
        pointLabels: {
          color: "#cbd5e1", // Nombres de los músculos (slate-300)
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-96 bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 shadow-lg rounded-xl p-4">
      <Radar options={chartOptions} data={chartData} />
    </div>
  );
}
