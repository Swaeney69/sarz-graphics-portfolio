export const portfolioData = {
  personal: {
    name: "Timi Osas",
    role: "Graphics Designer",
    headline: "Graphics Designer focused on clear, practical visual communication.",
    subtext: "I design logos, interfaces, and brand assets that help ideas communicate better — not louder.",
    email: "osastimi95@gmail.com",
    linkedin: "https://linkedin.com/in/timi-osas", // Placeholder
    whatsapp: "https://wa.me/1234567890", // Placeholder
  },
  about: {
    description: "I'm a graphics designer experienced in logo design, UI design (web), and brand assets. I use tools like Figma, Wix, Gamma AI, and various no-code tools to bring ideas to life. I have remote work experience and am known for clear communication and fast delivery. I believe in honest design—no exaggerated claims or fake metrics.",
    skills: [
      "Logo Design",
      "Brand Identity",
      "UI Design",
      "No-Code Tools",
      "Visual Consistency",
      "Client Communication",
    ],
    tools: ["Figma", "Wix", "Gamma AI", "No-code tools"],
  },
  projects: [
    {
      id: "1",
      title: "EcoBrand Identity",
      description: "Complete brand identity for a sustainable fashion startup.",
      type: "Brand Identity",
      tools: ["Figma", "Illustrator"],
      image: "/placeholder-project-1.svg",
      details: {
        problem: "The client needed a brand identity that communicated sustainability without falling into greenwashing clichés.",
        approach: "We focused on earthy tones and organic shapes, avoiding generic leaf icons. The typography was chosen to be modern yet approachable.",
        outcome: "A cohesive brand identity that helped the startup secure their first round of funding and launch successfully.",
      },
    },
    {
      id: "2",
      title: "FinTech Dashboard UI",
      description: "User interface design for a financial analytics dashboard.",
      type: "UI Design",
      tools: ["Figma"],
      image: "/placeholder-project-2.svg",
      details: {
        problem: "Users found the existing dashboard clutter and difficult to navigate, leading to high churn.",
        approach: "I simplified the layout, used a clear hierarchy for data visualization, and introduced a dark mode for power users.",
        outcome: "User engagement increased by 40% and support tickets regarding navigation dropped significantly.",
      },
    },
    {
      id: "3",
      title: "Coffee Shop Website",
      description: "Website design and build for a local coffee shop.",
      type: "Web Design",
      tools: ["Wix"],
      image: "/placeholder-project-3.svg",
      details: {
        problem: "The coffee shop had no online presence and customers couldn't find their menu or hours.",
        approach: "Built a simple, mobile-first website on Wix that captures the cozy atmosphere of the shop.",
        outcome: "Increased foot traffic and online orders for pickup.",
      },
    },
  ],
  testimonials: [
    {
      id: "1",
      text: "Timi was incredibly easy to work with. He understood our vision immediately and delivered high-quality work ahead of schedule.",
      author: "Client A",
      role: "Founder, Startup X",
    },
    {
      id: "2",
      text: "Clear communication and reliable delivery. No fluff, just good design that works.",
      author: "Client B",
      role: "Marketing Director",
    },
  ],
};
