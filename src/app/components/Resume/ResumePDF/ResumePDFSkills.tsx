import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeSkills } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
  settings,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
  settings: Settings;
}) => {
  const { featuredSkills, categories } = skills;
  const showFeaturedSkills = settings.formToShow.featuredSkills;

  if (!categories?.length && (!showFeaturedSkills || !featuredSkills?.length)) {
    return null;
  }

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol, gap: spacing[4] }}>
        {showFeaturedSkills && featuredSkills?.length > 0 && (
          <View style={{ ...styles.section }}>
            <ResumePDFText style={{ fontWeight: "bold", fontSize: "11pt", marginBottom: spacing[1] }}>
              Featured Skills
            </ResumePDFText>
            <View style={{ marginTop: spacing["1"] }}>
              <ResumePDFBulletList 
                items={featuredSkills.map(({ skill, rating }) => `${skill} (${rating}/5)`)} 
              />
            </View>
          </View>
        )}

        {categories?.map((category, idx) => (
          <View key={idx} style={{ ...styles.section }}>
            <ResumePDFText style={{ fontWeight: "bold", fontSize: "11pt", marginBottom: spacing[1] }}>
              {category.name}
            </ResumePDFText>
            <View style={{ marginTop: spacing["1"] }}>
              <ResumePDFBulletList items={category.skills} />
            </View>
          </View>
        ))}
      </View>
    </ResumePDFSection>
  );
};
