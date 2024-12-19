import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeReferences } from "lib/redux/types";

export const ResumePDFReferences = ({
  heading,
  references,
  themeColor,
}: {
  heading: string;
  references: ResumeReferences;
  themeColor: string;
}) => {
  if (!references.references.length) return null;

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol, gap: spacing[3] }}>
        {references.references.map((reference, idx) => (
          <View key={idx} style={styles.flexCol}>
            <ResumePDFText bold={true}>
              {reference.name} - {reference.title}
            </ResumePDFText>
            <ResumePDFText>{reference.company}</ResumePDFText>
            <ResumePDFText>
              {reference.email} • {reference.phone}
            </ResumePDFText>
          </View>
        ))}
      </View>
    </ResumePDFSection>
  );
};
