import { Icon } from "@iconify/react";

const getTierCoverage = (tier) => {
  if (!tier) return 10;
  const normalized = String(tier).toLowerCase();
  if (normalized.includes("gold")) return 100;
  if (normalized.includes("full")) return 70;
  if (normalized.includes("associate")) return 40;
  if (normalized.includes("free")) return 10;
  return 10;
};

const getCoverageMessage = (percent) => {
  if (percent >= 100) return "You have full access.";
  if (percent >= 70) return "Great progress! Unlock the final tier to see everything we curate.";
  if (percent >= 40) return "You're seeing a solid slice. Upgrade to reveal more high-value content.";
  return "You're getting a sneak peek. Upgrade to explore the full experience.";
};

export default function AccessCoverageCard({ mode, userTier, sectionLabel, onUpgrade }) {
  const percent = getTierCoverage(userTier);
  const primaryText = percent >= 100
    ? `You're viewing 100% of available ${sectionLabel.charAt(0).toUpperCase() + sectionLabel.slice(1)}.`
    : `You're currently viewing ${percent}% of available ${sectionLabel.charAt(0).toUpperCase() + sectionLabel.slice(1)}.`;

  return (
    <div
      className={`mb-6 p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-md transition-shadow duration-200 overflow-hidden ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="mdi:lock-open-variant" className="text-paan-dark-blue" width={22} height={22} />
            <span className={`text-sm tracking-wide ${mode === "dark" ? "text-gray-300" : "text-gray-500"}`}>
              Access coverage
            </span>
          </div>
          <div className="text-lg md:text-xl font-medium">{primaryText}</div>
          <p className={`mt-1 text-sm ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {getCoverageMessage(percent)}
          </p>
          <div className={`mt-4 h-3 rounded-full ${mode === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
            <div
              className="h-3 rounded-full bg-paan-blue shadow-sm transition-colors duration-200"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>Tier: {userTier || "Free Member"}</span>
            <span className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>{percent}% coverage</span>
          </div>
        </div>
        {percent < 100 && (
          <div className="shrink-0 flex md:block">
            <button
              onClick={onUpgrade}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white bg-paan-dark-blue hover:bg-paan-blue active:scale-[0.99] shadow-md transition-colors duration-200"
            >
              <Icon icon="mdi:rocket-launch" width={18} height={18} />
              <span>Upgrade for full access</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 