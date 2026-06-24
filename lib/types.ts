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

export type SupportRequest = {
  title: string;
  status: string;
};

export type Module = {
  number: string;
  title: string;
  description: string;
};
