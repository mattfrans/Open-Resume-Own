import { View, Text } from "@react-pdf/renderer";
import { ResumePDFSection, ResumePDFText } from "components/Resume/ResumePDF/common";
import { styles } from "components/Resume/ResumePDF/styles";
import type { ResumeSkills } from "lib/redux/types";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
}) => {
  const { featuredSkills, descriptions } = skills;

  if (!featuredSkills.length && !descriptions.length) {
    return null;
  }

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol, gap: 8 }}>
        {featuredSkills.length > 0 && (
          <View style={{ ...styles.section }}>
            <ResumePDFText bold={true}>Featured Skills</ResumePDFText>
            <View style={{ ...styles.flexRow, flexWrap: 'wrap' as const, gap: 4 }}>
              {featuredSkills.map(({ skill, rating }, idx) => (
                <View
                  key={idx}
                  style={{
                    ...styles.flexRow,
                    alignItems: 'center' as const,
                    marginRight: 12,
                    marginBottom: 4,
                  }}
                >
                  <ResumePDFText>{skill}</ResumePDFText>
                  <Text style={{ fontSize: 10, color: '#666' }}>
                    {" "}
                    ({rating}/5)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {descriptions.length > 0 && (
          <View style={{ ...styles.section }}>
            <ResumePDFText bold={true}>Additional Skills</ResumePDFText>
            <View style={{ ...styles.flexRow, flexWrap: 'wrap' as const }}>
              {descriptions.map((skill, idx) => (
                <View
                  key={idx}
                  style={{
                    marginRight: 12,
                    marginBottom: 4,
                  }}
                >
                  <ResumePDFText>{skill}</ResumePDFText>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ResumePDFSection>
  );
};
