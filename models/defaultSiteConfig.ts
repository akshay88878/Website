import type { SiteConfig } from "@/types/siteConfig";

export const defaultSiteConfig: SiteConfig = {
  sections: [
    {
      type: "hero",
      enabled: true,
      order: 1,
      alignment: "left",
      width: "wide"
    },
    {
      type: "highlights",
      enabled: true,
      order: 2,
      alignment: "center",
      width: "wide"
    }
  ],
  content: {
    siteName: "LOMAS AI",
    siteDescription:
      "LOMAS AI builds intelligent learning experiences for schools, educators, and modern classrooms across India.",
    navigation: {
      items: [
        { label: "Products", url: "/products" },
        { label: "Blogs", url: "/blogs" },
        { label: "About Us", url: "/about-us" },
        { label: "Contact Us", url: "/contact-us" }
      ]
    },
    hero: {
      eyebrow: "Learning Intelligence for India",
      title: "Empowering every learner in India with AI-driven teaching.",
      description:
        "LOMAS AI helps institutions modernize classrooms with intelligent lesson support, engaging student experiences, and scalable digital learning workflows.",
      primaryCta: {
        label: "Explore Products",
        href: "/products"
      },
      secondaryCta: {
        label: "Speak to the Team",
        href: "/contact-us"
      },
      illustrationSrc: "/images/hero-illustration.svg",
      illustrationAlt: "AI robot teaching learners in a modern digital classroom",
      alignment: "left",
      width: "wide",
      topSpacing: 50,
      imageWidthPercent: 50
    },
    highlights: {
      items: [
        "AI-led lesson intelligence",
        "Teacher-first classroom workflows",
        "Built for modern Indian learning environments"
      ],
      alignment: "center",
      width: "wide"
    },
    productsPage: {
      metaTitle: "Products",
      metaDescription:
        "Explore LOMAS AI products designed for AI-enabled teaching and classroom engagement.",
      eyebrow: "Products",
      title: "Intelligent products for modern education delivery",
      description:
        "Our platform and hardware experiences are designed to support scalable AI adoption across institutions, classrooms, and student engagement programs.",
      alignment: "center",
      width: "default",
      cardLabels: {
        eyebrow: "Product"
      },
      products: [
        {
          title: "AI Teaching System",
          description:
            "A classroom intelligence platform that helps educators personalize lessons, monitor learner progress, and deliver consistent outcomes.",
          detailSections: [
            {
              heading: "Tech Stack",
              style: "tags",
              items: ["Next.js", "TypeScript", "Firebase", "Analytics"]
            },
            {
              heading: "Features",
              style: "list",
              items: [
                "Adaptive lesson planning",
                "Student insight dashboards",
                "Teacher workflow automation"
              ]
            },
            {
              heading: "Use Case",
              style: "text",
              body:
                "Designed for schools and training centers that want AI-assisted teaching operations without increasing faculty overhead."
            }
          ]
        },
        {
          title: "ShravanBot",
          description:
            "An AI companion robot built to support engagement, conversation practice, and guided learning experiences in modern classrooms.",
          detailSections: [
            {
              heading: "Technology",
              style: "tags",
              items: ["Embedded AI", "Voice Interfaces", "Computer Vision", "Cloud Sync"]
            },
            {
              heading: "Features",
              style: "list",
              items: [
                "Interactive voice guidance",
                "Emotion-aware engagement",
                "Hybrid classroom companion workflows"
              ]
            },
            {
              heading: "Use Case",
              style: "text",
              body:
                "Built for experiential learning programs where institutions want a physical AI presence to increase attention and participation."
            }
          ]
        }
      ]
    },
    blogPage: {
      metaTitle: "Blogs",
      metaDescription:
        "Insights on AI, learning systems, and the future of education.",
      eyebrow: "Journal",
      title: "Evolution of AI",
      paragraphs: [
        "Artificial intelligence has moved from theoretical promise to practical infrastructure. In education, that shift matters because schools now expect technology to improve outcomes, not just digitize old workflows.",
        "The first wave of AI tools automated repetitive tasks. The next wave is more consequential: systems that understand context, personalize recommendations, and help educators act with better timing and confidence.",
        "For learning environments, the opportunity is not simply to add more software. It is to create experiences where teachers stay in control while AI handles insight generation, orchestration, and support at scale.",
        "LOMAS AI is built around that model. We see AI as an operating layer for better teaching, stronger learner engagement, and more consistent educational delivery."
      ],
      imageSrc: "/images/blog-illustration.svg",
      imageAlt: "Illustration representing the evolution of artificial intelligence",
      alignment: "left",
      width: "default"
    },
    aboutPage: {
      metaTitle: "About Us",
      metaDescription:
        "Meet the LOMAS AI team building trusted AI products for learning environments.",
      vision: {
        eyebrow: "Vision",
        title: "Building trusted AI infrastructure for every learning journey",
        description:
          "We believe the future of education will be shaped by systems that increase teacher capacity, deepen student engagement, and make institutional operations more intelligent. Our work focuses on practical AI that respects classroom realities while elevating educational quality at scale.",
        alignment: "center",
        width: "default"
      },
      ceoMessage: {
        eyebrow: "CEO Message",
        quote:
          '"LOMAS AI exists to make advanced learning technology accessible, credible, and deeply useful for institutions across India. We are not building novelty. We are building dependable systems that help educators lead with more clarity and impact."',
        signature: "Aarav Mehta, Founder & CEO",
        alignment: "center",
        width: "narrow"
      },
      team: {
        eyebrow: "Our Team",
        title: "Cross-functional operators with an education-first lens",
        groups: [
          {
            heading: "Our Mentors",
            members: [
              {
                name: "Aarav Mehta",
                role: "Founder & CEO",
                image: "/images/team/aarav.svg"
              },
              {
                name: "Naina Kapoor",
                role: "Head of Product Design",
                image: "/images/team/naina.svg"
              }
            ]
          },
          {
            heading: "Current Team",
            members: [
              {
                name: "Rohan Iyer",
                role: "Lead AI Systems Engineer",
                image: "/images/team/rohan.svg"
              },
              {
                name: "Mira Sethi",
                role: "Director, School Partnerships",
                image: "/images/team/mira.svg"
              }
            ]
          }
        ],
        alignment: "center",
        headingAlignment: "center",
        contentAlignment: "center",
        width: "wide"
      }
    },
    contactPage: {
      metaTitle: "Contact Us",
      metaDescription:
        "Reach out to LOMAS AI for product enquiries, partnerships, and institution onboarding.",
      eyebrow: "Contact",
      title: "Start a conversation with the LOMAS AI team",
      description:
        "Share your institution profile, partnership objective, or product interest. We will respond with the right team and next steps.",
      alignment: "center",
      width: "default",
      info: {
        registeredAddressHeading: "Registered Address",
        address: [
          "LOMAS AI Innovations Pvt. Ltd.",
          "3rd Floor, Knowledge Towers",
          "Bengaluru, Karnataka 560001",
          "India"
        ],
        emailHeading: "Email",
        email: "hello@lomasai.in",
        socialHeading: "Social Links",
        socialLinks: [
          { label: "LinkedIn", url: "https://www.linkedin.com" },
          { label: "X", url: "https://x.com" },
          { label: "YouTube", url: "https://www.youtube.com" }
        ]
      },
      form: {
        eyebrow: "Enquiry Form",
        title: "Tell us what you need",
        description:
          "Share the essentials. The form validates input and can route submissions through Firebase or MongoDB depending on environment configuration.",
        submitLabel: "Send Enquiry",
        fields: {
          nameLabel: "Name",
          namePlaceholder: "Your full name",
          emailLabel: "Email",
          emailPlaceholder: "name@school.edu",
          addressLabel: "Address",
          addressPlaceholder: "Institution or mailing address",
          purposeLabel: "Purpose",
          purposePlaceholder:
            "Tell us about your institution, use case, or partnership objective."
        }
      }
    }
  },
  theme: {
    primary: "#4F46E5",
    mode: "light",
    backgroundPalette: "aurora",
    sectionStyle: "glass",
    cardStyle: "elevated",
    primaryColor: "#4F46E5",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    accentColor: "#7C3AED"
  },
  footer: {
    text: "AI-powered education infrastructure for schools, educators, and learners across India.",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com" },
      { label: "X", url: "https://x.com" },
      { label: "YouTube", url: "https://www.youtube.com" }
    ],
    alignment: "left",
    brandName: "LOMAS AI",
    contactHeading: "Contact",
    socialHeading: "Social",
    email: "hello@lomasai.in",
    address: [
      "LOMAS AI Innovations Pvt. Ltd.",
      "3rd Floor, Knowledge Towers",
      "Bengaluru, Karnataka 560001",
      "India"
    ]
  }
};
