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
    category: "Business Opportunities",
    description:
      "Find gigs, tenders, and business opportunities to grow your agency",
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
    category: "Business Services",
    description: "Get legal compliance support and M&A advisory services",
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
  {
    category: "Talent & Recruitment",
    description: "Hire skilled freelancers and build your dream team",
    items: [
      {
        href: "/hire-freelancer",
        icon: "hugeicons:job-search",
        label: "Hire a Freelancer",
      },
    ],
  },
  {
    category: "Events & Training",
    description: "Attend events, training sessions, and the annual PAAN Summit",
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
      {
        href: "/paan-academy",
        icon: "mdi:school",
        label: "PAAN Academy",
      },
    ],
  },

  {
    category: "Resources & Support",
    description: "Access member resources, exclusive offers, and support hubs",
    items: [
      {
        href: "/member-resources",
        icon: "mdi:toolbox-outline",
        label: "Member Resources",
      },
      {
        href: "/market-intel",
        icon: "mdi:chart-line",
        label: "Market Intelligence",
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
    description:
      "Connect with other agencies through matchmaking and mentorship",
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
