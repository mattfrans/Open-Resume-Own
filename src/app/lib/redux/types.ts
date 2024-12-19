export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: string;
}

export interface ResumeWorkExperience {
  company: string;
  jobTitle: string;
  date: string;
  descriptions: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  date: string;
  gpa: string;
  descriptions: string[];
}

export interface ResumeProject {
  project: string;
  date: string;
  descriptions: string[];
}

export interface FeaturedSkill {
  skill: string;
  rating: number;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  categories: SkillCategory[];
}

export interface ResumeCustom {
  descriptions: string[];
}

export interface Reference {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface ResumeReferences {
  references: Reference[];
}

export interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  custom: ResumeCustom;
  references: ResumeReferences;
}

export type ResumeKey = keyof Resume;
