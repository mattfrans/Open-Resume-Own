"use client";
import { useEffect, useState, useRef } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { START_HOME_RESUME, END_HOME_RESUME } from "home/constants";
import { makeObjectCharIterator } from "lib/make-object-char-iterator";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";
import { deepClone } from "lib/deep-clone";

// countObjectChar(END_HOME_RESUME) -> ~1800 chars
const INTERVAL_MS = 50; // 20 Intervals Per Second
const CHARS_PER_INTERVAL = 10;
// Auto Typing Time:
//  10 CHARS_PER_INTERVAL -> ~1800 / (20*10) = 9s (let's go with 9s so it feels fast)
//  9 CHARS_PER_INTERVAL -> ~1800 / (20*9) = 10s
//  8 CHARS_PER_INTERVAL -> ~1800 / (20*8) = 11s

const RESET_INTERVAL_MS = 60 * 1000; // 60s

export const AutoTypingResume = () => {
  const [resume, setResume] = useState<Resume>({
    profile: {
      name: "",
      email: "",
      phone: "",
      url: "",
      summary: "",
      location: "",
    },
    workExperiences: [],
    educations: [],
    projects: [],
    skills: {
      featuredSkills: [],
      categories: []
    },
    custom: {
      descriptions: [],
    },
    references: {
      references: [],
    },
  });

  const [settings, setSettings] = useState<Settings>({
    ...initialSettings,
    fontFamily: "Roboto",
    fontSize: "12",
    formToHeading: {
      workExperiences: resume.workExperiences?.[0]?.company
        ? "WORK EXPERIENCE"
        : "",
      educations: resume.educations?.[0]?.school ? "EDUCATION" : "",
      projects: resume.projects?.[0]?.project ? "PROJECT" : "",
      skills: resume.skills?.featuredSkills?.length || resume.skills?.categories?.length
        ? "SKILLS"
        : "",
      custom: resume.custom?.descriptions?.length ? "CUSTOM" : "",
      references: resume.references?.references?.length ? "REFERENCES" : "",
    },
    formToShow: {
      workExperiences: true,
      educations: true,
      projects: true,
      skills: true,
      custom: true,
      references: true,
    },
    showBulletPoints: {
      workExperiences: true,
      educations: true,
      projects: true,
      custom: true,
    },
    formsOrder: [
      "workExperiences",
      "educations",
      "projects",
      "skills",
      "custom",
      "references",
    ],
  });

  const resumeCharIterator = useRef(
    makeObjectCharIterator(START_HOME_RESUME, END_HOME_RESUME)
  );
  const hasSetEndResume = useRef(false);
  const { isLg } = useTailwindBreakpoints();

  useEffect(() => {
    const intervalId = setInterval(() => {
      let next = resumeCharIterator.current.next();
      for (let i = 0; i < CHARS_PER_INTERVAL - 1; i++) {
        next = resumeCharIterator.current.next();
      }
      if (!next.done) {
        setResume(next.value);
      } else {
        // Sometimes the iterator doesn't end on the last char,
        // so we manually set its end state here
        if (!hasSetEndResume.current) {
          setResume(END_HOME_RESUME);
          hasSetEndResume.current = true;
        }
      }
    }, INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      resumeCharIterator.current = makeObjectCharIterator(
        START_HOME_RESUME,
        END_HOME_RESUME
      );
      hasSetEndResume.current = false;
    }, RESET_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setResume((prevResume) => {
        const newResume = { ...prevResume };

        // Update profile
        if (!newResume.profile.name) {
          newResume.profile.name = "Frans Mattsson";
          return newResume;
        }
        if (!newResume.profile.email) {
          newResume.profile.email = "frans.mattsson@protonmail.com";
          return newResume;
        }
        if (!newResume.profile.phone) {
          newResume.profile.phone = "+358 404 1890";
          return newResume;
        }
        if (!newResume.profile.url) {
          newResume.profile.url = "github.com/mattfrans";
          return newResume;
        }
        if (!newResume.profile.location) {
          newResume.profile.location = "Turku, Finland";
          return newResume;
        }

        // Update work experience
        if (newResume.workExperiences.length === 0) {
          newResume.workExperiences = [
            {
              company: "Vakka-Suomen Puhelin Oy",
              jobTitle: "Customer Service Representative",
              date: "September 2024-Present",
              descriptions: [
                "Maintained excellent billing efficiency rates (98% monthly while handling diverse banking transactions, account servicing, and customer service)",
                "Expertly navigated banking compliance requirements including KYC, AML, and data privacy regulations while providing exceptional customer service and accurate financial guidance",
                "Recognized as top performer for highest NPS improvement among customer service team (October-September), demonstrating excellence in customer satisfaction and service quality",
              ],
            },
            {
              company: "Aarre Avustajat Oy",
              jobTitle: "Personal Assistant",
              date: "Sep 2023 - Aug 2024",
              descriptions: [
                "Provided personalized support to clients, understanding their unique needs and preferences to ensure high-quality service",
                "Fostered strong and positive relationships with clients",
              ],
            },
            {
              company: "Avarn Security Oy",
              jobTitle: "HSE Security Guard",
              date: "Jun 2022 - Sep 2022",
              descriptions: [
                "Performed detailed HSE (Health, Safety, Environment) compliance checks throughout the shipyard, ensuring adherence to maritime safety protocols and identifying potential hazards in a high-risk construction environment",
                "Coordinated emergency response procedures and maintained detailed incident documentation while working closely with shipyard personnel, contractors, and emergency services to ensure workplace safety in a high-risk construction environment",
              ],
            },
            {
              company: "Sector Alarm Oy",
              jobTitle: "Direct Sales Representative",
              date: "Apr 2021 - May 2022",
              descriptions: [
                "Exceeded first-week sales lead targets, demonstrating rapid mastery of prospecting techniques",
                "Delivered effective sales presentations leading to deal closures",
                "Provided customized security solutions through consultative selling approach",
              ],
            },
          ];
          return newResume;
        }

        // Update education
        if (newResume.educations.length === 0) {
          newResume.educations = [
            {
              school: "Åbo Akademi University",
              degree: "Bachelor of Science",
              date: "Graduation: 2024",
              descriptions: ["Computer Science"],
            },
          ];
          return newResume;
        }

        // Update projects
        if (newResume.projects.length === 0) {
          newResume.projects = [
            {
              project: "Finnish Legal Assistant",
              date: "Winter 2024",
              descriptions: [
                "Built Finnish Legal Assistant, an AI-powered tool that streamlines legal research and citations for companies and professionals",
              ],
            },
            {
              project: "AI Santa",
              date: "Winter 2024",
              descriptions: [
                "Created AI Santa, an interactive experience that provides personalized holiday responses using artificial intelligence",
              ],
            },
            {
              project: "AI-Stock-Analysis",
              date: "Winter 2024",
              descriptions: [
                "Developed AI-Stock-Analysis, a tool using machine learning to analyze market trends and support investment decisions",
                "A tool using machine learning to analyze market trends and support investment decisions",
              ],
            },
          ];
          return newResume;
        }

        // Update skills
        if (newResume.skills.featuredSkills.length === 0) {
          newResume.skills = {
            featuredSkills: [
              { skill: "Python", rating: 5 },
              { skill: "JavaScript", rating: 4 },
              { skill: "TypeScript", rating: 4 },
              { skill: "React", rating: 4 },
              { skill: "Next.js", rating: 4 },
              { skill: "Node.js", rating: 4 },
              { skill: "SQL", rating: 4 },
              { skill: "Git", rating: 4 },
            ],
            categories: [
              {
                name: "Programming",
                skills: ["Machine Learning", "Data Analysis", "Web Development", "API Development"]
              },
              {
                name: "Soft Skills",
                skills: ["Problem Solving", "Team Collaboration"]
              }
            ]
          };
        }

        return newResume;
      });
    }, 500);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <>
      <ResumeIframeCSR documentSize="Letter" scale={isLg ? 0.7 : 0.5}>
        <ResumePDF
          resume={resume}
          settings={{
            ...initialSettings,
            fontSize: "12",
            formToHeading: {
              workExperiences: resume.workExperiences?.[0]?.company
                ? "WORK EXPERIENCE"
                : "",
              educations: resume.educations?.[0]?.school ? "EDUCATION" : "",
              projects: resume.projects?.[0]?.project ? "PROJECT" : "",
              skills: resume.skills?.featuredSkills?.length || resume.skills?.categories?.length
                ? "SKILLS"
                : "",
              custom: "CUSTOM SECTION",
            },
          }}
        />
      </ResumeIframeCSR>
    </>
  );
};
