import React from 'react';

import { Button, Card, Col, Text } from 'vajra-ui';

import { DetailHeader } from '../comps/detail-header';

export const JobDetailSection: React.FC = () => (
  <Col gap="s-4">
    <DetailHeader
      title="Senior React Native Dev"
      company="88khp"
      location="Remote"
      type="Full-time"
      salary="$120k–$150k"
    />
    <Card p="s-4" rounded="r-3" borderWidth={1} borderColor="border" gap="s-2">
      <Text variant="labelMedium">About the Role</Text>
      <Text variant="body" color="textMuted">
        We are looking for a Senior React Native Engineer to help build and maintain
        Vajra UI — a token-driven component library used by thousands of developers.
        You will own the component API, theming system, and documentation.
      </Text>
    </Card>
    <Card p="s-4" rounded="r-3" borderWidth={1} borderColor="border" gap="s-2">
      <Text variant="labelMedium">Requirements</Text>
      <Text variant="body" color="textMuted">· 4+ years React Native experience</Text>
      <Text variant="body" color="textMuted">· Strong TypeScript skills</Text>
      <Text variant="body" color="textMuted">· Experience with design systems</Text>
      <Text variant="body" color="textMuted">· Open source contributions preferred</Text>
    </Card>
    <Button label="Apply Now" variant="solid" onPress={() => {}} />
  </Col>
);
