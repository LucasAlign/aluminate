import type { AlumniProfile, CommunityPost, Module, SupportRequest } from "@/lib/types";

export const alumniSeed: AlumniProfile[] = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    cohort: "2023",
    school: "Wyomissing Area",
    industry: "Digital media",
    email: "maya.chen@example.com",
    phone: "484-555-0198",
    city: "Wyomissing, PA",
    business: "Brand studio for student founders",
    status: "Founder",
    skills: "Branding, websites, social media. Needs help with pricing retainers.",
    openToMentor: true
  },
  {
    id: "ari-rivera",
    name: "Ari Rivera",
    cohort: "2024",
    school: "Reading High",
    industry: "Apparel",
    email: "ari.rivera@example.com",
    phone: "484-555-0142",
    city: "Reading, PA",
    business: "Local apparel pop-up brand",
    status: "Launching",
    skills: "Retail, pop-ups, sales. Needs vendor fair contacts.",
    openToMentor: false
  },
  {
    id: "jada-lee",
    name: "Jada Lee",
    cohort: "2025",
    school: "Exeter",
    industry: "Food concept",
    email: "jada.lee@example.com",
    phone: "484-555-0176",
    city: "Exeter, PA",
    business: "Weekend dessert catering idea",
    status: "Early idea",
    skills: "Menu testing, customer discovery. Needs licensing guidance.",
    openToMentor: false
  },
  {
    id: "noah-patel",
    name: "Noah Patel",
    cohort: "2022",
    school: "Wilson",
    industry: "Lawn care",
    email: "noah.patel@example.com",
    phone: "484-555-0113",
    city: "Sinking Spring, PA",
    business: "Neighborhood lawn care service",
    status: "Operating",
    skills: "Hiring, estimates, operations. Open to mentor younger alumni.",
    openToMentor: true
  },
  {
    id: "sofia-martinez",
    name: "Sofia Martinez",
    cohort: "2024",
    school: "Muhlenberg",
    industry: "Beauty services",
    email: "sofia.martinez@example.com",
    phone: "484-555-0187",
    city: "Laureldale, PA",
    business: "Mobile nail art studio",
    status: "Founder",
    skills: "Client scheduling, brand partnerships, customer referrals.",
    openToMentor: true
  }
];

export const learningModules: Module[] = [
  {
    number: "01",
    title: "Market Analysis",
    description: "Customer, competition, and opportunity."
  },
  {
    number: "02",
    title: "Legal Entity Basics",
    description: "LLC, insurance, and risk decisions."
  },
  {
    number: "03",
    title: "Pitch Deck Studio",
    description: "Story, numbers, visuals, and practice."
  }
];

export const communityPosts: CommunityPost[] = [
  {
    id: "ari-pop-up",
    author: "Ari Rivera",
    cohort: "2024 alumni",
    business: "apparel startup",
    timeAgo: "18 min ago",
    category: "Startup Win",
    tone: "coral",
    body: "First weekend pop-up is booked. I used the pricing worksheet from EEA and finally feel confident about margins.",
    reactions: 18,
    comments: 4
  },
  {
    id: "jada-menu",
    author: "Jada Lee",
    cohort: "2025 alumni",
    business: "food concept",
    timeAgo: "42 min ago",
    category: "Mentor Ask",
    tone: "violet",
    body:
      "Does anyone have experience testing a menu before renting kitchen space? Looking for a mentor who knows food licensing basics.",
    note: "Gary from the sponsor network can help. Tap Support to request an intro.",
    reactions: 9,
    comments: 7
  }
];

export const supportCategories = [
  "Business idea feedback",
  "Pitch review",
  "Marketing help",
  "Funding guidance",
  "Mentor intro",
  "Website or brand"
];

export const supportRequests: SupportRequest[] = [
  {
    id: "pitch-review",
    title: "Pitch review",
    category: "Pitch review",
    status: "Assigned to EEA staff",
    detail: "Review deck flow before next practice night."
  },
  {
    id: "food-licensing",
    title: "Food licensing",
    category: "Mentor intro",
    status: "Waiting on mentor match",
    detail: "Find someone familiar with cottage food and kitchen rental decisions."
  },
  {
    id: "website-feedback",
    title: "Website feedback",
    category: "Website or brand",
    status: "Resolved yesterday",
    detail: "Homepage copy and pricing section were reviewed."
  }
];

export const viewTitles = {
  community: "Community Home",
  directory: "Alumni Directory",
  learn: "Learning Hub",
  support: "Support Center",
  profile: "My Profile",
  admin: "Admin Portal"
} as const;

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
