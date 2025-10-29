import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
} from '@react-email/components';

interface VerificationEmailProps {
  email: string;
  verifyCode: string;
}

export default function VerificationEmail({ email, verifyCode }: VerificationEmailProps) {
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

      <Section style={styles.section}>
        <Container style={styles.container}>
          <Heading as="h2" style={styles.heading}>
            Welcome, {email}!
          </Heading>

          <Text style={styles.text}>
            Thanks for joining us! Please use the code below to verify your account.
          </Text>

          <div style={styles.centeredBox}>
            <Text style={styles.code}>{verifyCode}</Text>

            <Button
              href={`https://localhost:3000/auth/verify/${email}`}
              style={styles.button}
            >
              Verify Account
            </Button>
          </div>

          <Text style={styles.footer}>
            If you didn’t request this, you can safely ignore this email.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const styles = {
  section: {
    backgroundColor: '#f4f4f7',
    padding: '40px 0',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Roboto, Verdana, sans-serif',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  centeredBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
    gap: '20px',
  },
  code: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#f0f0f0',
    padding: '12px 20px',
    borderRadius: '6px',
    letterSpacing: '2px',
    textAlign: 'center' as const,
  },
  button: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '16px',
    textDecoration: 'none',
    fontWeight: 'bold',
    textAlign: 'center' as const,
  },
  footer: {
    fontSize: '14px',
    color: '#999',
  },
};
