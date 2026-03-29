import styles from './styles.module.css';

const CARDS = [
  { title: 'Museums to Visit', color: 'blue' },
  { title: 'Weekend Trip', color: 'yellow' },
  { title: 'Meditation', color: 'pink' },
  { title: 'Commute thoughts', color: 'gray' },
  { title: 'Reading list', color: 'red' },
  { title: 'Workout routine', color: 'gray' },
  { title: 'Lecture Notes', color: 'green' },
  { title: 'Shopping List', color: 'blue' },
];

export default function ReferenceBoardPage() {
  return (
    <main className={styles.page}>
      <div className={styles.phone}>
        <header className={styles.headerRow}>
          <div className={styles.time}>9:41</div>
          <div className={styles.dynamicIsland} aria-hidden="true" />
          <div className={styles.statusDots} aria-hidden="true" />
        </header>

        <section className={styles.grid}>
          {CARDS.map((card) => (
            <article key={card.title} className={`${styles.card} ${styles[card.color]}`}>
              <h2>{card.title}</h2>
              <div className={styles.lines}>
                <span />
                <span />
                <span />
              </div>
            </article>
          ))}
        </section>

        <footer className={styles.bottomNav}>
          <button aria-label="Home">🏠</button>
          <button aria-label="Checklist">☑️</button>
          <button className={styles.focusBtn} aria-label="Focus">
            🌼
          </button>
          <button aria-label="Add">＋</button>
        </footer>
      </div>
    </main>
  );
}
