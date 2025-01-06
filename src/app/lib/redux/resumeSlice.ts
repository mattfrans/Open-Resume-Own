import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import type {
  FeaturedSkill,
  Reference,
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeReferences,
  ResumeSkills,
  ResumeWorkExperience,
  SkillCategory,
} from "lib/redux/types";
import type { ShowForm } from "lib/redux/settingsSlice";

export const initialProfile: ResumeProfile = {
  name: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  url: "",
};

export const initialWorkExperience: ResumeWorkExperience = {
  company: "",
  jobTitle: "",
  date: "",
  descriptions: [],
};

export const initialEducation: ResumeEducation = {
  school: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [],
};

export const initialProject: ResumeProject = {
  project: "",
  date: "",
  descriptions: [],
};

export const initialReference: Reference = {
  name: "",
  title: "",
  company: "",
  email: "",
  phone: "",
};

export const initialFeaturedSkill: FeaturedSkill = { skill: "", rating: 4 };
export const initialFeaturedSkills: FeaturedSkill[] = Array(6).fill({
  ...initialFeaturedSkill,
});
export const initialSkills: ResumeSkills = {
  featuredSkills: [],
  categories: [],
};

export const initialReferences: ResumeReferences = {
  references: [],
};

export const initialCustom = {
  descriptions: [],
};

export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [structuredClone(initialWorkExperience)],
  educations: [],
  projects: Array.isArray([]) ? [] : [structuredClone(initialProject)],
  skills: initialSkills,
  custom: {
    descriptions: [],
  },
  references: {
    references: [],
  },
};

// Keep the field & value type in sync with CreateHandleChangeArgsWithDescriptions (components\ResumeForm\types.ts)
export type CreateChangeActionWithDescriptions<T> = {
  idx: number;
} & (
  | {
      field: Exclude<keyof T, "descriptions">;
      value: string;
    }
  | { field: "descriptions"; value: string[] }
);

export const resumeSlice = createSlice({
  name: "resume",
  initialState: initialResumeState,
  reducers: {
    changeProfile(draft, action: PayloadAction<Partial<ResumeProfile>>) {
      Object.assign(draft.profile, action.payload);
    },
    changeWorkExperiences(
      draft,
      action: PayloadAction<{
        idx: number;
        field: keyof ResumeWorkExperience;
        value: string | string[];
      }>
    ) {
      const { idx, field, value } = action.payload;
      const workExperience = draft.workExperiences[idx] || structuredClone(initialWorkExperience);
      workExperience[field] = value;
      draft.workExperiences[idx] = workExperience;
    },
    changeEducations(draft, action: PayloadAction<ResumeEducation[]>) {
      draft.educations = action.payload;
    },
    changeProjects(
      draft,
      action: PayloadAction<{
        idx: number;
        field: keyof ResumeProject;
        value: string | string[];
      }>
    ) {
      if (!Array.isArray(draft.projects)) {
        draft.projects = [structuredClone(initialProject)];
      }
      const { idx, field, value } = action.payload;
      if (!draft.projects[idx]) {
        draft.projects[idx] = structuredClone(initialProject);
      }
      draft.projects[idx][field] = value;
    },
    changeSkills(
      draft,
      action: PayloadAction<{
        featuredSkills?: FeaturedSkill[];
        categories?: { name: string; skills: string[] }[];
      }>
    ) {
      if (action.payload.featuredSkills !== undefined) {
        draft.skills.featuredSkills = action.payload.featuredSkills;
      }
      if (action.payload.categories !== undefined) {
        draft.skills.categories = action.payload.categories;
      }
    },
    changeCustom(draft, action: PayloadAction<{ descriptions: string[] }>) {
      draft.custom = action.payload;
    },
    changeReferences(draft, action: PayloadAction<{ references: Reference[] }>) {
      draft.references = action.payload;
    },
    addSectionInForm: (draft, action: PayloadAction<{ form: ShowForm }>) => {
      const { form } = action.payload;
      switch (form) {
        case "workExperiences": {
          draft.workExperiences.push(structuredClone(initialWorkExperience));
          return draft;
        }
        case "educations": {
          draft.educations.push(structuredClone(initialEducation));
          return draft;
        }
        case "projects": {
          draft.projects.push(structuredClone(initialProject));
          return draft;
        }
      }
    },
    moveSectionInForm: (
      draft,
      action: PayloadAction<{
        form: ShowForm;
        idx: number;
        direction: "up" | "down";
      }>
    ) => {
      const { form, idx, direction } = action.payload;
      if (form !== "skills" && form !== "custom" && form !== "references") {
        if (
          (idx === 0 && direction === "up") ||
          (idx === draft[form].length - 1 && direction === "down")
        ) {
          return draft;
        }

        const section = draft[form][idx];
        if (direction === "up") {
          draft[form][idx] = draft[form][idx - 1];
          draft[form][idx - 1] = section;
        } else {
          draft[form][idx] = draft[form][idx + 1];
          draft[form][idx + 1] = section;
        }
      }
    },
    deleteSectionInFormByIdx: (
      draft,
      action: PayloadAction<{ form: ShowForm; idx: number }>
    ) => {
      const { form, idx } = action.payload;
      if (form !== "skills" && form !== "custom" && form !== "references") {
        draft[form].splice(idx, 1);
      }
    },
    setResume: (draft, action: PayloadAction<Resume>) => {
      return action.payload;
    },
  },
});

export const {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  changeCustom,
  changeReferences,
  addSectionInForm,
  moveSectionInForm,
  deleteSectionInFormByIdx,
  setResume,
} = resumeSlice.actions;

export const selectResume = (state: RootState) => state.resume;
export const selectProfile = (state: RootState) => state.resume.profile;
export const selectWorkExperiences = (state: RootState) => state.resume.workExperiences;
export const selectEducations = (state: RootState) => state.resume.educations;
export const selectProjects = (state: RootState) =>
  Array.isArray(state.resume.projects) ? state.resume.projects : [structuredClone(initialProject)];
export const selectSkills = (state: RootState) => state.resume.skills;
export const selectReferences = (state: RootState) => state.resume.references;
export const selectCustom = (state: RootState) => state.resume.custom;

export default resumeSlice.reducer;
