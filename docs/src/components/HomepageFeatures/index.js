import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Comprehensive Project Summaries',
    Svg: require('@site/static/img/feature-summary.svg').default,
    description: (
      <>
        Generate detailed knowledge transfer documents that capture the essence of your project's architecture, components, and patterns.
      </>
    ),
  },
  {
    title: 'Semantic Understanding',
    Svg: require('@site/static/img/feature-semantic.svg').default,
    description: (
      <>
        Extract domain-specific concepts and terminology to help LLMs understand your project's unique language and context.
      </>
    ),
  },
  {
    title: 'Optimized for LLMs',
    Svg: require('@site/static/img/feature-llm.svg').default,
    description: (
      <>
        Designed specifically for AI assistants, providing the right context and structure for more accurate and helpful responses.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}