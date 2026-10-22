import React from 'react';

import { Col } from 'vajra-ui';
import { TVajraColors } from 'vajra-ui';

import { JobCard } from '../comps/job-card';

type TJob = { title: string; company: string; location: string; type: string; salary: string; bg: TVajraColors };

const JOBS: TJob[] = [
  { title: 'Senior React Native Dev', company: '88khp', location: 'Remote', type: 'Full-time', salary: '$120k–$150k', bg: 'primarySubtle' },
  { title: 'UI/UX Designer', company: 'PixelCraft', location: 'Bangalore', type: 'Full-time', salary: '$80k–$100k', bg: 'secondarySubtle' },
  { title: 'Frontend Engineer', company: 'Shopify', location: 'Remote', type: 'Contract', salary: '$90/hr', bg: 'successSubtle' },
  { title: 'Mobile Lead', company: 'Zomato', location: 'Delhi', type: 'Full-time', salary: '$110k–$130k', bg: 'warningSubtle' },
];

export const JobsSection: React.FC = () => (
  <Col gap="s-3">
    {JOBS.map(j => (
      <JobCard key={j.title} {...j} />
    ))}
  </Col>
);
