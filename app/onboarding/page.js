import Link from 'next/link';
import styles from './styles.module.css';

export default function OnboardingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.tag}>For new users</p>
        <h1 className={styles.title}>Onboarding</h1>
        <p className={styles.subtitle}>This is a placeholder screen for first-time peeps.</p>
        <Link className={styles.proceedBtn} href="/reference-board">
          Proceed
        </Link>
      </div>
    </main>
  );
}
