import Chart from "react-apexcharts";
import { format } from "date-fns";
import { hasTierAccess } from "@/utils/tierUtils"; // Import hasTierAccess

const StatsChart = ({
  opportunities,
  events,
  resources,
  offers,
  marketIntel,
  updates,
  user,
  mode,
  getLastUpdatedForSection,
  useRouter,
}) => {
  const router = useRouter();

  // Data for the chart
  const series = [
    opportunities.filter((item) => hasTierAccess(item.tier_restriction, user))
      .length,
    events.filter((item) => hasTierAccess(item.tier_restriction, user)).length,
    resources.filter((item) => hasTierAccess(item.tier_restriction, user))
      .length,
    offers.filter((item) => hasTierAccess(item.tier_restriction, user)).length,
    marketIntel.filter((item) => hasTierAccess(item.tier_restriction, user))
      .length,
    updates.filter((item) => hasTierAccess(item.tier_restriction, user)).length,
  ];

  const labels = [
    "Active Opportunities",
    "Upcoming Events",
    "New Resources",
    "Available Offers",
    "Market Intel",
    "Updates",
  ];

  const colors = [
    "#3B82F6", // Blue for Opportunities
    "#10B981", // Green for Events
    "#8B5CF6", // Purple for Resources
    "#F59E0B", // Orange for Offers
    "#FBBF24", // Amber for Market Intel
    "#EC4899", // Pink for Updates
  ];

  const options = {
    chart: {
      type: "polarArea",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const sectionLinks = [
            "/opportunities",
            "/events",
            "/resources",
            "/offers",
            "/market-intel",
            "/updates",
          ];
          router.push(sectionLinks[config.dataPointIndex]);
        },
      },
    },
    labels: labels,
    colors: colors,
    legend: {
      position: "bottom",
      labels: {
        colors: mode === "dark" ? "#ffffff" : "#1f2937",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => opts.w.config.series[opts.seriesIndex],
      style: {
        colors: ["#ffffff"],
        fontSize: "12px",
      },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor: mode === "dark" ? "#4b5563" : "#e5e7eb",
        },
        spokes: {
          strokeWidth: 1,
          connectorColors: mode === "dark" ? "#4b5563" : "#e5e7eb",
        },
      },
    },
    stroke: {
      width: 1,
      colors: [mode === "dark" ? "#4b5563" : "#e5e7eb"],
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      custom: ({ series, seriesIndex, w }) => {
        const lastUpdated = getLastUpdatedForSection(labels[seriesIndex]);
        const value = series[seriesIndex];
        const label = labels[seriesIndex];
        return `
          <div class="apexcharts-tooltip-custom" style="
            background: ${
              mode === "dark"
                ? "rgba(31, 41, 55, 0.6)"
                : "rgba(255, 255, 255, 0.6)"
            };
            backdrop-filter: blur(10px);
            color: ${mode === "dark" ? "#ffffff" : "#000000"};
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid ${mode === "dark" ? "#4b5563" : "#e5e7eb"};
            font-size: 12px;
            line-height: 1.5;
          ">
            <strong>${label}</strong><br>
            ${value} items<br>
            Last updated: ${
              lastUpdated && !isNaN(new Date(lastUpdated))
                ? format(new Date(lastUpdated), "MMM d, yyyy 'at' h:mm a")
                : "No recent updates"
            }
          </div>
        `;
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
  };

  return (
    <div
      className={`p-6 rounded-2xl ${
        mode === "dark"
          ? "bg-gray-900/60 border-gray-700"
          : "bg-white border-gray-200"
      } border shadow-lg`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          mode === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        Dashboard Statistics
      </h2>
      <Chart options={options} series={series} type="polarArea" height={350} />
    </div>
  );
};

export default StatsChart;
