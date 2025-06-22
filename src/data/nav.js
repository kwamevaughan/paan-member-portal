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
    category: "Regional Hubs",
    items: [
      {
        href: "/regional-hubs",
        icon: "mdi:office-building",
        label: "Access Hubs",
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
      {
        href: "/events?eventType=networking",
        icon: "mdi:account-group",
        label: "Networking Events",
      },
      {
        href: "/events?eventType=workshop",
        icon: "mdi:school",
        label: "Workshops & Training",
      },
      {
        href: "/events?eventType=webinar",
        icon: "mdi:video",
        label: "Webinars",
      },
      {
        href: "/events?eventType=conference",
        icon: "mdi:presentation",
        label: "Conferences & Seminars",
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
