export type Product = {
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  useCase: string;
};

export const products: Product[] = [
  {
    title: "AI Teaching System",
    description:
      "A classroom intelligence platform that helps educators personalize lessons, monitor learner progress, and deliver consistent outcomes.",
    techStack: ["Next.js", "TypeScript", "Firebase", "Analytics"],
    features: [
      "Adaptive lesson planning",
      "Student insight dashboards",
      "Teacher workflow automation"
    ],
    useCase:
      "Designed for schools and training centers that want AI-assisted teaching operations without increasing faculty overhead."
  },
  {
    title: "ShravanBot",
    description:
      "An AI companion robot built to support engagement, conversation practice, and guided learning experiences in modern classrooms.",
    techStack: ["Embedded AI", "Voice Interfaces", "Computer Vision", "Cloud Sync"],
    features: [
      "Interactive voice guidance",
      "Emotion-aware engagement",
      "Hybrid classroom companion workflows"
    ],
    useCase:
      "Built for experiential learning programs where institutions want a physical AI presence to increase attention and participation."
  }
];
