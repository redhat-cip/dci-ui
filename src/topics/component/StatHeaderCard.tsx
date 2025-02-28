import {
  CardBody,
  Card,
  Content,
  ContentVariants,
} from "@patternfly/react-core";

type StatHeaderCardProps = {
  title: string;
  subTitle: string;
};

export default function StatHeaderCard({
  title,
  subTitle,
}: StatHeaderCardProps) {
  return (
    <Card>
      <CardBody>
        <Content component={ContentVariants.h6}>{subTitle}</Content>
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            lineHeight: "2.25rem",
          }}
        >
          {title}
        </h1>
      </CardBody>
    </Card>
  );
}
