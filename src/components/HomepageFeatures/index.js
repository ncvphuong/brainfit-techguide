import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [
   {
    title: 'Overview',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Overview of BrainFit ACP, basic system information and general guides.
      </>
    ),
    link: '/docs/brainfit-singapore'
  },
  {
    title: 'Guideline',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Detailed guidelines for the main functions in the admin page.
      </>
    ),
    link: '/docs/category/guideline'
  },
  {
    title: 'Processes',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Standard processes and workflows for development and operations.
      </>
    ),
    link: '/docs/category/processes'
  }
];

function Feature({Svg, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
    <Link to={link} className={styles.featureLink}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </Link>
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
