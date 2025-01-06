import { Page, View, Document } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { ResumePDFReferences } from "components/Resume/ResumePDF/ResumePDFReferences";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";

export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom, references } =
    resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToShow,
    formToHeading,
    showBulletPoints,
    formsOrder,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);
  const skillsIndex = showFormsOrder.indexOf("skills");
  const formsBeforeSkills = skillsIndex !== -1 ? showFormsOrder.slice(0, skillsIndex) : showFormsOrder;
  const formsAfterSkills = skillsIndex !== -1 ? showFormsOrder.slice(skillsIndex + 1) : [];

  const formToComponent: { [form in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["workExperiences"]}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={Array.isArray(projects) ? projects : []}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["projects"]}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        settings={settings}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
      />
    ),
    references: () => (
      <ResumePDFReferences
        heading={formToHeading["references"]}
        references={references}
        themeColor={themeColor}
      />
    ),
  };

  return (
    <>
      <Document title={`${name} Resume`} author={name} producer={"OpenResume"}>
        {/* First Page - Everything except Skills */}
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            ...styles.flexCol,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
          }}
        >
          {Boolean(settings.themeColor) && (
            <View
              style={{
                width: spacing["full"],
                height: spacing[3.5],
                backgroundColor: themeColor,
              }}
            />
          )}
          <View
            style={{
              ...styles.flexCol,
              padding: `${spacing[0]} ${spacing[20]}`,
            }}
          >
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
            />
            {showFormsOrder
              .filter((form) => form !== "skills")
              .map((form) => {
                const Component = formToComponent[form];
                return <Component key={form} />;
              })}
          </View>
        </Page>

        {/* Skills Page */}
        {formToShow["skills"] && (
          <Page
            size={documentSize === "A4" ? "A4" : "LETTER"}
            style={{
              ...styles.flexCol,
              color: DEFAULT_FONT_COLOR,
              fontFamily,
              fontSize: fontSize + "pt",
            }}
          >
            {Boolean(settings.themeColor) && (
              <View
                style={{
                  width: spacing["full"],
                  height: spacing[3.5],
                  backgroundColor: themeColor,
                }}
              />
            )}
            <View
              style={{
                ...styles.flexCol,
                padding: `${spacing[0]} ${spacing[20]}`,
              }}
            >
              {formToComponent["skills"]()}
            </View>
          </Page>
        )}
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
