export const sidebarNav = [
  {
    items: [
      {
        href: "/dashboard",
        icon: "material-symbols:home-outline",
        label: "Dashboard",
      },
    ],
  },
  {
    items: [
      {
        href: "/business-opportunities",
        icon: "charm:lightbulb",
        label: (jobType) =>
          jobType?.toLowerCase() === "freelancer" ? "Gigs" : "Opportunities",
      },
    ],
  },
  {
    category: "Market Intelligence",
    items: [
      {
        href: "/market-intel",
        icon: "mdi:chart-bar",
        label: "Industry Reports",
      },
      {
        href: "/updates",
        icon: "mdi:bullhorn",
        label: "Latest News",
      },
    ],
  },
  {
    category: "Events & Training",
    items: [
      {
        href: "/events",
        icon: "mdi:calendar-star",
        label: "Events",
      },
      {
        href: "/paan-summit",
        icon: "mdi:trophy",
        label: "PAAN Summit",
      },
    ],
  },
  {
    category: "Resources & Support",
    items: [
      {
        href: "/resources",
        icon: "mdi:toolbox-outline",
        label: "Resources",
      },
      {
        href: "/offers",
        icon: "mdi:tag",
        label: "Offers",
      },
      {
        href: "/access-hubs",
        icon: "mdi:office-building",
        label: "Access Hubs",
      },
    ],
  },
  {
    category: "Networking & Growth",
    items: [
      {
        href: "/matchmaking",
        icon: "fluent:handshake-16-regular",
        label: "Matchmaking",
      },
      {
        href: "/mentorship",
        icon: "mdi:account-supervisor",
        label: "Mentorship",
      },
    ],
  },
  {
    category: "Business Services",
    items: [
      {
        href: "/legal-compliance",
        icon: "mdi:gavel",
        label: "Legal & Compliance",
      },
      {
        href: "/mergers-acquisitions",
        icon: "mdi:merge",
        label: "Mergers & Acquisitions",
      },
    ],
  },
];

// Filter navigation for freelancers
export const getFilteredNav = (jobType) => {
  if (jobType?.toLowerCase() === "freelancer") {
    return sidebarNav.filter((item) =>
      ["Dashboard", "Opportunities"].includes(item.category)
    );
  }
  return sidebarNav;
};
