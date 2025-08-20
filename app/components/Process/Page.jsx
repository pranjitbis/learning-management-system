import styles from './Process.module.css';

export default function Process() {
  const steps = [
    {
      icon: 'fa-lightbulb',
      title: 'Step 01',
      description: 'Register with us'
    },
    {
      icon: 'fa-headset',
      title: 'Step 02',
      description: 'Get a call from our senior executives'
    },
    {
      icon: 'fa-magnifying-glass-plus',
      title: 'Step 03',
      description: 'Provide required information'
    },
    {
      icon: 'fa-credit-card',
      title: 'Step 04',
      description: 'Pay the chosen course fee'
    },
    {
      icon: 'fa-graduation-cap',
      title: 'Step 05',
      description: 'Kudos! You have access to the course'
    }
  ];

  return (
    <section className={styles.process}>
      <h2 className={styles.sectionTitle}>How It Works</h2>
      <div className={styles.processTimeline}>
        {steps.map((step, index) => (
          <div className={styles.processStep} key={index}>
            <div className={styles.stepIcon}><i className={`fa-solid ${step.icon}`}></i></div>
            <div className={styles.stepContent}>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
