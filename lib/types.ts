export type UserRole = "alumni" | "admin";

export type ViewKey = "community" | "directory" | "learn" | "support" | "profile" | "admin";

export type AlumniProfile = {
  id: string;
  name: string;
  cohort: string;
  school: string;
  industry: string;
  email: string;
  phone: string;
  city: string;
  business: string;
  status: string;
  skills: string;
  openToMentor: boolean;
};

export type CommunityPost = {
  id: string;
  author: string;
  cohort: string;
  business: string;
  timeAgo: string;
  category: string;
  tone: "coral" | "green" | "blue" | "violet";
  body: string;
  note?: string;
  reactions: number;
  comments: number;
};

export type SupportRequest = {
  id: string;
  title: string;
  category: string;
  status: string;
  detail: string;
};

export type Module = {
  number: string;
  title: string;
  description: string;
};
