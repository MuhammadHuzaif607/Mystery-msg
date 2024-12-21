// VerificationEmail.js
import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Link,
} from '@react-email/components';

const VerificationEmail = ({
  username,
  verificationLink,
}: {
  username: any;
  verificationLink: any;
}) => (
  <Html>
    <Head />
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Heading style={styles.heading}>Verify Your Account</Heading>
        <Text style={styles.text}>Hello {username},</Text>
        <Text style={styles.text}>
          Thanks for signing up! Please verify your email address by clicking
          the button below.
        </Text>
        <Link style={styles.button} href={verificationLink}>
          Verify Account {verificationLink}
        </Link>
        <Text style={styles.footer}>
          If you didn’t sign up for this account, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
);

const styles = {
  main: {
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    display: 'block',
  },
  heading: {
    color: '#333333',
    fontSize: '24px',
    marginBottom: '20px',
  },
  text: {
    color: '#555555',
    fontSize: '16px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  footer: {
    color: '#999999',
    fontSize: '14px',
    marginTop: '30px',
  },
};

export default VerificationEmail;
