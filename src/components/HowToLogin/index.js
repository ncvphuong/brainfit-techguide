import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const STEPS = [
  { img: '/img/login/login-1.png', title: '1. Sign in', text: 'Open hq.brainfitstudio.com, type your username and password, and click Sign in. The eye icon shows or hides what you type.' },
  { img: '/img/login/login-3.png', title: '2. Enter the code (staff with 2FA)', text: 'If your account uses two-factor sign-in, we email you a 6-digit code. Type it in: it submits by itself. The code lasts 10 minutes, and Resend code sends a new one.' },
  { img: '/img/login/login-2.png', title: 'Lost your password?', text: 'Click Lost your password?, enter your email address and click Send temporary password.' },
  { img: '/img/login/login-4.png', title: 'Enter the temporary password', text: 'Copy the temporary password from the email. It is valid for 24 hours; if it has expired, click Send a new one.' },
  { img: '/img/login/login-5.png', title: 'Set a new password', text: 'Choose a new password that meets the requirements (the list and the strength meter update as you type), type it again to confirm, and click Update password.' },
];

function Step({ img, title, text }) {
  const src = useBaseUrl(img);
  return (
    <div className={styles.step}>
      <img src={src} alt={title} loading="lazy" />
      <Heading as="h3">{title}</Heading>
      <p>{text}</p>
    </div>
  );
}

export default function HowToLogin() {
  const phone = useBaseUrl('/img/login/login-phone.png');
  return (
    <section className={styles.section} id="how-to-log-in-to-brainfit-hq">
      <div className="container">
        <Heading as="h2" className="text--center">How to log in to BrainFit HQ</Heading>
        <div className={styles.lead}>
          <p>
            BrainFit HQ has its own address: <a href="https://hq.brainfitstudio.com">hq.brainfitstudio.com</a>. It always opens the new Brain HQ look.
            The older address, acp.brainfitstudio.com, still works exactly as before, with its own login and the theme switch.
          </p>
          <p><strong>First time on hq?</strong> Log in once: signing in on acp does not carry over to hq.</p>
        </div>
        <div className={styles.steps}>
          {STEPS.map((s) => <Step key={s.img} {...s} />)}
        </div>
        <div className={styles.notes}>
          <p>The login page works on a phone too:</p>
          <div className={styles.phone}><img src={phone} alt="Brain HQ login page on a phone" loading="lazy" /></div>
        </div>
      </div>
    </section>
  );
}
