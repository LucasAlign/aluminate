import type { AlumniProfile, CommunityPost, Conversation, Module, SupportRequest } from "@/lib/types";

const alumniLeadershipSource = "https://www.linkedin.com/posts/emerging-entrepreneurs-academy_eea2026-alumni-networking-activity-7474906729839837184-XEKf";
const officialLinkedIn = "https://www.linkedin.com/company/emerging-entrepreneurs-academy";

const publicAlumniDefaults = {
  email: "",
  phone: "",
  city: "Berks County, PA",
  verifiedPublic: true,
  sourceLabel: "Public EEA source",
  openToMentor: false
} as const;

export const alumniSeed: AlumniProfile[] = [
  {
    ...publicAlumniDefaults,
    id: "hailey-lopez",
    name: "Hailey Lopez",
    cohort: "2023",
    school: "Not publicly listed",
    industry: "Leadership",
    business: "EEA Alumni Association",
    status: "Alumni President",
    skills: "Business planning, leadership, public speaking, and alumni mentorship.",
    openToMentor: true,
    sourceUrl: alumniLeadershipSource
  },
  {
    ...publicAlumniDefaults,
    id: "michelle-karanja",
    name: "Michelle Karanja",
    cohort: "Alumni",
    school: "Penn State Berks",
    industry: "Accounting & finance",
    city: "Reading, PA",
    business: "EEA Alumni Association",
    status: "Vice President",
    skills: "Accounting, finance, networking, and peer mentorship.",
    openToMentor: true,
    sourceLabel: "EEA and public professional profile",
    sourceUrl: "https://www.linkedin.com/in/michelle-karanja-a45664279"
  },
  {
    ...publicAlumniDefaults,
    id: "ston-nelson",
    name: "Ston Nelson",
    cohort: "2025",
    school: "Kutztown University",
    industry: "Law & real estate",
    city: "Reading, PA",
    business: "EEA Alumni Association",
    status: "Program Director",
    skills: "Leadership, real estate, public service, and alumni mentoring.",
    openToMentor: true,
    sourceLabel: "Public professional profile",
    sourceUrl: "https://www.linkedin.com/in/ston-nelson-764aa5256"
  },
  {
    ...publicAlumniDefaults,
    id: "nneoma-deborah-uchendu",
    name: "Nneoma Deborah Uchendu",
    cohort: "Alumni",
    school: "Indiana University of Pennsylvania",
    industry: "Communications",
    business: "EEA Alumni Association",
    status: "Communications Director",
    skills: "Communications, community building, and professional networking.",
    openToMentor: true,
    sourceLabel: "EEA and public professional profile",
    sourceUrl: "https://www.linkedin.com/in/nneoma-deborah-uchendu-331749233"
  },
  {
    ...publicAlumniDefaults,
    id: "nolin-bourland",
    name: "Nolin Bourland",
    cohort: "Alumni",
    school: "Governor Mifflin",
    industry: "Operations",
    business: "Pinky's Junk Removal",
    status: "Events Co-Chair",
    skills: "Operations, events, and peer mentorship.",
    openToMentor: true,
    sourceUrl: "https://www.linkedin.com/posts/christine-kreisher-1b702741_thank-you-kristi-it-was-an-honor-to-have-activity-7480637450885890050-70YP"
  },
  {
    ...publicAlumniDefaults,
    id: "braeden-ruth",
    name: "Braeden Ruth",
    cohort: "Alumni",
    school: "Alvernia University",
    industry: "Hospitality & business",
    city: "Reading, PA",
    business: "Duck Donuts Wyomissing",
    status: "Events Co-Chair",
    skills: "Events, hospitality, business, and alumni engagement.",
    openToMentor: true,
    sourceLabel: "EEA and public professional profile",
    sourceUrl: "https://www.linkedin.com/in/braeden-ruth-475752231"
  },
  {
    ...publicAlumniDefaults,
    id: "carter-hamm",
    name: "Carter Hamm",
    cohort: "Alumni",
    school: "Not publicly listed",
    industry: "Programming & leadership",
    city: "Robesonia, PA",
    business: "EEA Alumni Association",
    status: "Programming Director",
    skills: "Program planning, fundraising, mentorship, and alumni leadership.",
    openToMentor: true,
    sourceLabel: "Public professional profile",
    sourceUrl: "https://www.linkedin.com/in/carter-hamm-202309365"
  },
  {
    ...publicAlumniDefaults,
    id: "abigail-santiago",
    name: "Abigail Santiago",
    cohort: "2026",
    school: "Not publicly listed",
    industry: "Cosmetology",
    business: "Skin Sanctuary internship",
    status: "Graduate",
    skills: "Digital media, marketing, financial literacy, and business culture.",
    sourceLabel: "Graduate's public announcement",
    sourceUrl: "https://www.linkedin.com/posts/abigail-santiago-0524a7412_emergingentrepreneursacademy-classof2026-activity-7489728838093012994-qETE"
  },
  {
    ...publicAlumniDefaults,
    id: "jayvian-rodriguez",
    name: "Jayvian Rodriguez",
    cohort: "2026",
    school: "Not publicly listed",
    industry: "Entrepreneurship",
    business: "EEA Dream Pitch",
    status: "Graduate",
    skills: "Budgeting, marketing, resumes, leadership, and business fundamentals.",
    sourceLabel: "Graduate's public announcement",
    sourceUrl: "https://www.linkedin.com/posts/activity-7487870558106480640-mXu7"
  },
  {
    ...publicAlumniDefaults,
    id: "isha-kaur",
    name: "Isha Kaur",
    cohort: "2026",
    school: "Not publicly listed",
    industry: "Leadership",
    business: "EEA Dream Pitch",
    status: "Class Representative",
    skills: "Leadership, public speaking, teamwork, and business planning.",
    sourceUrl: officialLinkedIn
  },
  {
    ...publicAlumniDefaults,
    id: "david-uchendu",
    name: "David Uchendu",
    cohort: "2026",
    school: "Not publicly listed",
    industry: "Entrepreneurship",
    business: "EEA Dream Pitch",
    status: "Graduate",
    skills: "Leadership, teamwork, and business planning.",
    sourceUrl: officialLinkedIn
  },
  {
    ...publicAlumniDefaults,
    id: "amrit-kalra",
    name: "Amrit Kalra",
    cohort: "2026",
    school: "Not publicly listed",
    industry: "Marketing & finance",
    business: "Mail Shark internship",
    status: "Graduate",
    skills: "Growth marketing, client negotiation, product management, and company culture.",
    sourceLabel: "EEA public internship feature",
    sourceUrl: "https://www.linkedin.com/posts/emerging-entrepreneurs-academy_this-is-what-our-program-is-all-about-so-activity-7496548117509545984-0oaH"
  },
  {
    ...publicAlumniDefaults,
    id: "yuvraj-singh",
    name: "Yuvraj Singh",
    cohort: "2026",
    school: "Not publicly listed",
    industry: "Software & AI",
    business: "Pinky's Junk Removal internship",
    status: "Graduate",
    skills: "Software development, AI, digital marketing, SEO, and analytics dashboards.",
    sourceLabel: "Public internship reflection",
    sourceUrl: "https://www.linkedin.com/posts/yuvraj-singh-1532b7418_what-happens-when-you-give-high-schoolers-activity-7493094171164098560--IgM"
  },
  {
    ...publicAlumniDefaults,
    id: "noemi-evelyn-barretta",
    name: "Noemi Evelyn Barretta",
    cohort: "2026",
    school: "Not publicly listed",
    industry: "Photography",
    business: "Studio 413 Photography internship",
    status: "Graduate",
    skills: "Studio lighting, camera settings, photography, and business fundamentals.",
    sourceUrl: officialLinkedIn
  },
  {
    ...publicAlumniDefaults,
    id: "axel-tejada",
    name: "Axel Tejada",
    cohort: "2026",
    school: "Not publicly listed",
    industry: "Photography",
    business: "Studio 413 Photography internship",
    status: "Graduate",
    skills: "Studio lighting, camera settings, photography, and business fundamentals.",
    sourceUrl: officialLinkedIn
  },
  {
    ...publicAlumniDefaults,
    id: "melvyn-frazier",
    name: "Melvyn C.C. Frazier Jr.",
    cohort: "Alumni",
    school: "Reading High School",
    industry: "Apparel",
    city: "Reading, PA",
    business: "Saint Melly 223",
    status: "In memoriam",
    skills: "Fashion, creativity, and entrepreneurship.",
    canMessage: false,
    sourceLabel: "Public memorial",
    sourceUrl: "https://www.legacy.com/us/obituaries/name/melvyn-frazier-obituary?id=58729674"
  }
];

export const demoProfile: AlumniProfile = {
  id: "demo-alumni",
  name: "Demo Alumni",
  cohort: "2026",
  school: "Emerging Entrepreneurs Academy",
  industry: "Entrepreneurship",
  email: "",
  phone: "",
  city: "Berks County, PA",
  business: "My next venture",
  status: "Active",
  skills: "Add your goals, skills, and the kind of help you can offer.",
  openToMentor: false,
  canMessage: true
};

export const conversationSeed: Conversation[] = [
  {
    id: "eea-alumni-team",
    participantName: "EEA Alumni Team",
    participantDetail: "Program announcements and alumni help",
    unread: 1,
    messages: [
      {
        id: "welcome-message",
        sender: "them",
        body: "Welcome to Aluminate! Use Messages to ask the alumni team a question or connect with someone in the directory.",
        sentAt: "Today, 9:15 AM"
      }
    ]
  },
  {
    id: "eea-support-desk",
    participantName: "EEA Support Desk",
    participantDetail: "Private help from program staff",
    unread: 0,
    messages: [
      {
        id: "support-tip",
        sender: "them",
        body: "Need structured help? Submit a request in Support. Use this conversation for a quick private question.",
        sentAt: "Yesterday"
      }
    ]
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
    id: "alumni-welcome",
    author: "EEA Alumni Team",
    cohort: "Program update",
    business: "Alumni Association",
    timeAgo: "Today",
    category: "Welcome",
    tone: "blue",
    body: "Welcome to the Aluminate preview. Browse verified public alumni profiles, start a private conversation, or ask the community for help.",
    reactions: 12,
    comments: 2
  },
  {
    id: "mentor-tip",
    author: "EEA Support Team",
    cohort: "Program resource",
    business: "Mentor network",
    timeAgo: "Yesterday",
    category: "Getting Started",
    tone: "violet",
    body: "Not sure where to begin? Open a verified alumni profile and choose Message, or use Support when you want EEA staff to coordinate an introduction.",
    note: "Private messages stay separate from public community posts.",
    reactions: 8,
    comments: 1
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
  messages: "Messages",
  learn: "Learning Hub",
  "student-portal": "Student Portal",
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
