import { normalizeTier } from "../Badge";

export default function ProfileSidebar({ user, mode }) {
  const getMembershipBadge = () => {
    const userTier = normalizeTier(user?.selected_tier) || "Free Member";
    const tierToBadgeMap = {
      "Free Member": "Free-Member",
      "Associate Member": "Associate-Member",
      "Full Member": "Full-Member",
      "Gold Member": "Gold-Member",
      Admin: "Gold-Member",
    };
    const badgeFileName = tierToBadgeMap[userTier] || "Free-Member";
    const badgeUrl = `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.webp`;

    return (
      <div className="relative group">
        <img
          src={badgeUrl}
          alt={`${userTier} Badge`}
          width={120}
          height={120}
          className="object-contain mx-auto group-hover:scale-110 transition-transform duration-300"
          draggable={false}
          onError={(e) => {
            e.target.src = `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.png`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </div>
    );
  };

  return (
    <div className="lg:col-span-1">
      {/* Membership Badge Card */}
      <div
        className={`rounded-2xl p-6 shadow-xl ${
          mode === "dark"
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border border-gray-100"
        }`}
      >
        <h4
          className={`text-lg text-center font-bold mb-4 ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Membership Badge
        </h4>
        <div className="text-center">{getMembershipBadge()}</div>
      </div>
    </div>
  );
}
