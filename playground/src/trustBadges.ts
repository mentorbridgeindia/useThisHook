export interface TrustBadge {
  label: string;
  href: string;
  imageSrc: string;
}

const SONAR_SUMMARY = 'https://sonarcloud.io/summary/new_code?id=senthilkumar979_useThisHook';
const SONAR_MEASURE =
  'https://sonarcloud.io/api/project_badges/measure?project=senthilkumar979_useThisHook';
const SNYK_TEST = 'https://snyk.io/test/github/senthilkumar979/useThisHook';

export const trustBadges: TrustBadge[] = [
  {
    label: 'CI',
    href: 'https://github.com/senthilkumar979/useThisHook/actions/workflows/ci.yml',
    imageSrc: 'https://github.com/senthilkumar979/useThisHook/actions/workflows/ci.yml/badge.svg',
  },
  {
    label: 'Codecov',
    href: 'https://codecov.io/gh/senthilkumar979/useThisHook',
    imageSrc: 'https://codecov.io/gh/senthilkumar979/useThisHook/graph/badge.svg',
  },
  {
    label: 'SonarCloud Quality Gate',
    href: SONAR_SUMMARY,
    imageSrc: `${SONAR_MEASURE}&metric=alert_status`,
  },
  {
    label: 'SonarCloud Security Rating',
    href: SONAR_SUMMARY,
    imageSrc: `${SONAR_MEASURE}&metric=security_rating`,
  },
  {
    label: 'Snyk known vulnerabilities',
    href: SNYK_TEST,
    imageSrc: `${SNYK_TEST}/badge.svg`,
  },
];
