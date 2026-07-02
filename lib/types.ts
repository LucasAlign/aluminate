export type UserRole = "alumni" | "admin";

export type ViewKey = "community" | "directory" | "learn" | "support" | "profile" | "admin";

export type AlumniProfile = {
  id: string;
  uid?: string;
  role?: UserRole;
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
  authorId?: string;
  author: string;
  cohort: string;
  business: string;
  timeAgo: string;
  category: string;
  tone: "coral" | "green" | "blue" | "violet";
  body: string;
  note?: string;
  attachments?: PostAttachment[];
  reactions: number;
  comments: number;
  createdAt?: number;
};

export type PostAttachment = {
  id: string;
  name: string;
  kind: "image" | "file";
  url?: string;
  label?: string;
  storagePath?: string;
  contentType?: string;
  size?: number;
};

export type SupportRequest = {
  id: string;
  authorId?: string;
  title: string;
  category: string;
  status: string;
  detail: string;
  createdAt?: number;
};

export type Module = {
  number: string;
  title: string;
  description: string;
};
