export const sidebarNav = [
  {
    category: "Dashboard",
    items: [
      {
        href: "/dashboard",
        icon: "mdi:view-dashboard",
        label: "Dashboard Overview",
      },
    ],
  },
  {
    category: "Business Opportunities",
    items: [
      {
        href: "/business-opportunities",
        icon: "mdi:briefcase",
        label: (jobType) =>
          jobType?.toLowerCase() === "freelancer"
            ? "View Gigs"
            : "View Opportunities",
      },
      {
        href: "/business-opportunities?opportunityType=tender",
        icon: "mdi:clipboard-text",
        label: "View Tenders",
      },
    ],
  },
  {
    category: "Access Hubs",
    items: [
      {
        href: "/access-hubs",
        icon: "mdi:office-building",
        label: "View Access Hubs",
      },
    ],
  },
  {
    category: "Updates",
    items: [
      {
        href: "/updates",
        icon: "mdi:bullhorn",
        label: "Latest News",
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
    ],
  },
  {
    category: "Events",
    items: [
      {
        href: "/events",
        icon: "mdi:calendar-star",
        label: "All Events",
      },
    ],
  },
  {
    category: "Resources",
    items: [
      {
        href: "/resources",
        icon: "mdi:book-open",
        label: "Knowledge Hub",
      },
    ],
  },
  {
    category: "Offers",
    items: [
      {
        href: "/offers",
        icon: "mdi:tag",
        label: "Exclusive Offers",
      },
    ],
  },
];

// Filter navigation for freelancers
export const getFilteredNav = (jobType) => {
  if (jobType?.toLowerCase() === "freelancer") {
    return sidebarNav.filter((item) =>
      ["Dashboard", "Business Opportunities"].includes(item.category)
    );
  }
  return sidebarNav;
};
