// Mission Control v2 - Data & Content
const AppData = {
    user: {
        name: "Skaar",
        role: "Filmmaker | Entrepreneur",
        location: "UK/Europe",
        citizenship: "Canadian"
    },
    
    goals: [
        {
            id: "filmmaker",
            icon: "🎬",
            title: "Filmmaker Career",
            subtitle: "Secure funding for documentary/animation/film",
            color: "purple",
            progress: 35,
            status: "active",
            description: "Canadian filmmaker seeking funding opportunities. Open to UK/Europe and global opportunities.",
            pathways: [
                {
                    name: "Grant Applications",
                    tasks: 5,
                    completed: 2
                },
                {
                    name: "Pitch Decks",
                    tasks: 3,
                    completed: 1
                },
                {
                    name: "Network Building",
                    tasks: 8,
                    completed: 3
                }
            ]
        },
        {
            id: "whitelabl",
            icon: "🏭",
            title: "Whitelabl.in",
            subtitle: "Scale white-label cosmetics manufacturing",
            color: "blue",
            progress: 15,
            status: "active",
            description: "Grow the India-based white-label cosmetics business through organic SEO and partnerships.",
            pathways: [
                {
                    name: "SEO Content",
                    tasks: 20,
                    completed: 0
                },
                {
                    name: "Partnerships",
                    tasks: 5,
                    completed: 0
                },
                {
                    name: "Email Funnel",
                    tasks: 4,
                    completed: 0
                }
            ]
        },
        {
            id: "wildonmedia",
            icon: "🚚",
            title: "WildOnMedia",
            subtitle: "Expand OOH advertising agency",
            color: "orange",
            progress: 25,
            status: "active",
            description: "Grow the digital ad trucks and experiential marketing business.",
            pathways: [
                {
                    name: "Client Acquisition",
                    tasks: 6,
                    completed: 1
                },
                {
                    name: "Media Kit",
                    tasks: 3,
                    completed: 1
                },
                {
                    name: "Case Studies",
                    tasks: 4,
                    completed: 0
                }
            ]
        },
        {
            id: "appideas",
            icon: "💡",
            title: "App/Web Projects",
            subtitle: "Build editable websites (no-code friendly)",
            color: "teal",
            progress: 5,
            status: "planning",
            description: "Website ideas that regular web designers can edit (WordPress/Webflow/Framer).",
            pathways: [
                {
                    name: "Ideation",
                    tasks: 3,
                    completed: 1
                },
                {
                    name: "MVP Build",
                    tasks: 5,
                    completed: 0
                }
            ]
        }
    ],
    
    tasks: {
        completed: [
            {
                id: 1,
                title: "Created Mission Control dashboard v1",
                goal: "appideas",
                date: "2026-02-13",
                type: "done"
            },
            {
                id: 2,
                title: "Built Whitelabl Growth Strategy PDF",
                goal: "whitelabl",
                date: "2026-02-13",
                type: "done"
            },
            {
                id: 3,
                title: "Analyzed whitelabl.in website structure",
                goal: "whitelabl",
                date: "2026-02-13",
                type: "done"
            },
            {
                id: 4,
                title: "Created animated GIFs for testing",
                goal: "appideas",
                date: "2026-02-13",
                type: "done"
            },
            {
                id: 5,
                title: "Analyzed WildOnMedia website",
                goal: "wildonmedia",
                date: "2026-02-13",
                type: "done"
            },
            {
                id: 6,
                title: "Researched zero-ad growth strategy",
                goal: "whitelabl",
                date: "2026-02-13",
                type: "done"
            },
            {
                id: 7,
                title: "Set up workspace preferences",
                goal: "general",
                date: "2026-02-12",
                type: "done"
            },
            {
                id: 8,
                title: "Named sub-agents (Avi, Mira, Sid)",
                goal: "general",
                date: "2026-02-12",
                type: "done"
            }
        ],
        
        active: [
            // FILMMAKER TASKS
            {
                id: 101,
                title: "Research Telefilm Canada funding programs",
                goal: "filmmaker",
                priority: "high",
                due: "2026-02-20",
                description: "Check Canada Media Fund, Telefilm, and provincial grants for documentary/animation"
            },
            {
                id: 102,
                title: "Research UK Film Council & BFI funding",
                goal: "filmmaker",
                priority: "high",
                due: "2026-02-22",
                description: "British Film Institute, Creative England, Film Hub North opportunities"
            },
            {
                id: 103,
                title: "Research European MEDIA Programme",
                goal: "filmmaker",
                priority: "high",
                due: "2026-02-25",
                description: "EU funding for cross-border film projects"
            },
            {
                id: 104,
                title: "Research Hot Docs Forum & IDFA Forum",
                goal: "filmmaker",
                priority: "medium",
                due: "2026-03-01",
                description: "International documentary pitching forums with funding opportunities"
            },
            {
                id: 105,
                title: "Create documentary pitch deck template",
                goal: "filmmaker",
                priority: "high",
                due: "2026-02-28",
                description: "Visual deck with logline, synopsis, treatment, team, budget"
            },
            {
                id: 106,
                title: "Build filmmaker portfolio website",
                goal: "filmmaker",
                priority: "medium",
                due: "2026-03-10",
                description: "Showreel, past work, bio, contact - editable by web designer"
            },
            {
                id: 107,
                title: "List on production databases",
                goal: "filmmaker",
                priority: "low",
                due: "2026-03-15",
                description: "ProductionHUB, Staff Me Up, etc."
            },
            
            // WHITELABL TASKS
            {
                id: 201,
                title: "Fix lorem ipsum testimonials on whitelabl.in",
                goal: "whitelabl",
                priority: "urgent",
                due: "2026-02-18",
                description: "Replace placeholder text with real client stories"
            },
            {
                id: 202,
                title: "Write About Us origin story",
                goal: "whitelabl",
                priority: "high",
                due: "2026-02-20",
                description: "Why you started Whitelabl - personal founder story"
            },
            {
                id: 203,
                title: "Add trust signals (ISO/GMP badges)",
                goal: "whitelabl",
                priority: "high",
                due: "2026-02-22",
                description: "Manufacturing unit photos, certifications"
            },
            {
                id: 204,
                title: "Write blog: CDSCO License Guide 2025",
                goal: "whitelabl",
                priority: "high",
                due: "2026-02-25",
                description: "Complete guide for cosmetic brand licensing in India"
            },
            {
                id: 205,
                title: "Write blog: How to Price Private Label Products",
                goal: "whitelabl",
                priority: "medium",
                due: "2026-03-01",
                description: "Pricing strategy for D2C brands"
            },
            {
                id: 206,
                title: "Create landing page: Mumbai manufacturer",
                goal: "whitelabl",
                priority: "medium",
                due: "2026-03-05",
                description: "Location-specific SEO page"
            },
            {
                id: 207,
                title: "Create landing page: Delhi manufacturer",
                goal: "whitelabl",
                priority: "medium",
                due: "2026-03-08",
                description: "Location-specific SEO page"
            },
            {
                id: 208,
                title: "Build email lead magnet: 12 Licenses Checklist",
                goal: "whitelabl",
                priority: "high",
                due: "2026-02-28",
                description: "PDF checklist for new cosmetic brands"
            },
            {
                id: 209,
                title: "Set up Brevo/Mailchimp free account",
                goal: "whitelabl",
                priority: "high",
                due: "2026-02-25",
                description: "Email automation platform"
            },
            {
                id: 210,
                title: "Draft 5-email welcome sequence",
                goal: "whitelabl",
                priority: "medium",
                due: "2026-03-10",
                description: "Day 0, 2, 5, 10, 14 sequence"
            },
            {
                id: 211,
                title: "Partner outreach: D2C course creators",
                goal: "whitelabl",
                priority: "medium",
                due: "2026-03-15",
                description: "Offer 10% student discount"
            },
            {
                id: 212,
                title: "Partner outreach: CA/CS firms",
                goal: "whitelabl",
                priority: "low",
                due: "2026-03-20",
                description: "Referral commission structure"
            },
            {
                id: 213,
                title: "Answer Quora questions weekly",
                goal: "whitelabl",
                priority: "medium",
                due: "ongoing",
                description: "Target: 'start cosmetic business India' queries"
            },
            
            // WILDONMEDIA TASKS
            {
                id: 301,
                title: "Create case study: past digital truck campaign",
                goal: "wildonmedia",
                priority: "high",
                due: "2026-02-25",
                description: "Results, metrics, client testimonial"
            },
            {
                id: 302,
                title: "Build professional media kit PDF",
                goal: "wildonmedia",
                priority: "high",
                due: "2026-03-01",
                description: "Specs, rates, audience data, examples"
            },
            {
                id: 303,
                title: "Add client logos to website",
                goal: "wildonmedia",
                priority: "high",
                due: "2026-02-22",
                description: "Social proof section"
            },
            {
                id: 304,
                title: "Create LinkedIn content calendar",
                goal: "wildonmedia",
                priority: "medium",
                due: "2026-02-28",
                description: "OOH marketing insights, behind-the-scenes"
            },
            {
                id: 305,
                title: "List on advertising directories",
                goal: "wildonmedia",
                priority: "low",
                due: "2026-03-10",
                description: "Clutch, Agency Spotter, etc."
            },
            {
                id: 306,
                title: "Reach out to event marketing agencies",
                goal: "wildonmedia",
                priority: "medium",
                due: "2026-03-05",
                description: "Partnership for festival/event coverage"
            },
            
            // APP IDEAS TASKS
            {
                id: 401,
                title: "Document 3 app ideas with specs",
                goal: "appideas",
                priority: "medium",
                due: "2026-02-28",
                description: "Features, target users, tech stack"
            },
            {
                id: 402,
                title: "Choose no-code platform for MVP",
                goal: "appideas",
                priority: "low",
                due: "2026-03-15",
                description: "Webflow vs Framer vs WordPress vs Bubble"
            }
        ]
    },
    
    events: [
        { date: "2026-02-20", title: "Telefilm Research Due", type: "deadline", goal: "filmmaker" },
        { date: "2026-02-22", title: "BFI Research Due", type: "deadline", goal: "filmmaker" },
        { date: "2026-02-25", title: "CDSCO Blog Due", type: "deadline", goal: "whitelabl" },
        { date: "2026-03-01", title: "WildOn Media Kit Due", type: "deadline", goal: "wildonmedia" }
    ],
    
    opportunities: {
        filmmaker: [
            {
                name: "Telefilm Canada - Production Program",
                amount: "$250K - $2M CAD",
                deadline: "Rolling",
                type: "Grant",
                url: "https://telefilm.ca"
            },
            {
                name: "Canada Media Fund",
                amount: "Up to $1.5M CAD",
                deadline: "Quarterly",
                type: "Grant",
                url: "https://cmf-fmc.ca"
            },
            {
                name: "BFI Network",
                amount: "£15K - £100K GBP",
                deadline: "Rolling",
                type: "Grant",
                url: "https://bfi.net"
            },
            {
                name: "Creative Europe MEDIA",
                amount: "€50K - €1M EUR",
                deadline: "Annual calls",
                type: "Grant",
                url: "https://creative-europe.ec.europa.eu"
            },
            {
                name: "Hot Docs Forum",
                amount: "Pitch + funding meetings",
                deadline: "Dec 2026 (for 2027)",
                type: "Market",
                url: "https://hotdocs.ca"
            },
            {
                name: "IDFA Forum",
                amount: "Co-production market",
                deadline: "Aug 2026",
                type: "Market",
                url: "https://idfa.nl"
            },
            {
                name: "Sundance Documentary Fund",
                amount: "$20K - $50K USD",
                deadline: "Rolling",
                type: "Grant",
                url: "https://sundance.org"
            }
        ]
    }
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppData;
}
