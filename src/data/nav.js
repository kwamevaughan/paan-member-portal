export const sidebarNav = [
  {
    items: [
      {
        href: "/dashboard",
        icon: "mdi:view-dashboard",
        label: "Dashboard",
      },
    ],
  },
  {
    items: [
      {
        href: "/business-opportunities",
        icon: "mdi:briefcase",
        label: (jobType) =>
          jobType?.toLowerCase() === "freelancer" ? "Gigs" : "Opportunities",
      },
    ],
  },
  {
    items: [
      {
        href: "/access-hubs",
        icon: "mdi:office-building",
        label: "Access Hubs",
      },
    ],
  },
  {
    items: [
      {
        href: "/updates",
        icon: "mdi:bullhorn",
        label: "Latest News",
      },
    ],
  },
  {
    items: [
      {
        href: "/market-intel",
        icon: "mdi:chart-bar",
        label: "Industry Reports",
      },
    ],
  },
  {
    items: [
      {
        href: "/events",
        icon: "mdi:calendar-star",
        label: "Events & Training",
      },
    ],
  },
  {
    items: [
      {
        href: "/resources",
        icon: "mdi:book-open",
        label: "Resources",
      },
    ],
  },
  {
    items: [
      {
        href: "/offers",
        icon: "mdi:tag",
        label: "Offers",
      },
    ],
  },
  {
    items: [
      {
        href: "/matchmaking",
        icon: "mdi:account-group",
        label: "Matchmaking",
      },
    ],
  },
  {
    items: [
      {
        href: "/mentorship",
        icon: "mdi:account-group",
        label: "Mentorship",
      },
    ],
  },
  {
    items: [
      {
        href: "/legal-compliance",
        icon: "mdi:gavel",
        label: "Legal & Compliance",
      },
    ],
  },
  {
    items: [
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
