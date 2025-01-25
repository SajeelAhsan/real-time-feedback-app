import * as React from "react";
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  try {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Here&apos;s your Verification code: {otp}</Preview>
        <Section>
          <Row>
            <Heading>Hello {username},</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for registering. Please use the following Verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{otp}</Text>
          </Row>
          <Row>
            <Text>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
        </Section>
      </Html>
    );
  } catch (error) {
    console.error("Error rendering email:", error);
    throw error;
  }
}
