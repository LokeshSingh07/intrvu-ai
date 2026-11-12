import {
  Html,
  Head,
  Body,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Button,
  Container,
  Hr,
} from '@react-email/components';

interface VerificationEmailProps {
  email: string;
  verifyCode: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function VerificationEmail({ email, verifyCode }: VerificationEmailProps) {
  const verifyUrl = `${baseUrl}/auth/verify/${encodeURIComponent(email)}`;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Email</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your verification code is: {verifyCode}</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>Intrvu</Text>

          <Heading as="h2" style={styles.heading}>
            Verify your email
          </Heading>

          <Text style={styles.text}>
            Hi there, thanks for joining us! Use the code below to verify
            your account <strong>{email}</strong>.
          </Text>

          <Section style={styles.codeSection}>
            <Text style={styles.code}>{verifyCode}</Text>
          </Section>

          <Text style={styles.hint}>
            This code will expire soon. Don&apos;t share it with anyone.
          </Text>

          <Section style={styles.buttonSection}>
            <Button href={verifyUrl} style={styles.button}>
              Verify Account
            </Button>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            If you didn&apos;t request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f4f4f7',
    margin: 0,
    padding: '40px 0',
    fontFamily: 'Roboto, Verdana, sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  brand: {
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: '#4f46e5',
    margin: '0 0 24px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#333333',
    margin: '0 0 16px',
  },
  text: {
    fontSize: '16px',
    color: '#555555',
    lineHeight: '1.5',
    margin: '0 0 24px',
  },
  codeSection: {
    textAlign: 'center' as const,
    margin: '0 0 12px',
  },
  code: {
    display: 'inline-block',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#f0f0f0',
    padding: '12px 24px',
    borderRadius: '6px',
    letterSpacing: '6px',
    margin: 0,
  },
  hint: {
    fontSize: '13px',
    color: '#888888',
    textAlign: 'center' as const,
    margin: '0 0 28px',
  },
  buttonSection: {
    textAlign: 'center' as const,
    margin: '0 0 32px',
  },
  button: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
  },
  hr: {
    borderColor: '#eeeeee',
    margin: '0 0 20px',
  },
  footer: {
    fontSize: '13px',
    color: '#999999',
    margin: 0,
  },
};