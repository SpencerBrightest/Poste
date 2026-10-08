// React Email template for verifying the email sending pipeline
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface TestEmailProps {
  name: string;
}

// Renders a simple confirmation email to validate Resend integration
export default function TestEmail({ name }: TestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Poste email delivery is working</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>It works, {name}!</Heading>
          <Text style={text}>
            This is a test email from Poste, confirming the sending pipeline is wired up correctly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f6f6", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" };
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "480px" };
const heading = { fontSize: "22px", color: "#111" };
const text = { fontSize: "15px", color: "#333", lineHeight: "22px" };
