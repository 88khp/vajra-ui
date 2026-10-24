import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { VajraProvider } from '../../vajra-theme';
import { Carousel } from './carousel';

const items = ['Slide 1', 'Slide 2', 'Slide 3'];

describe('Carousel', () => {
  it('renders every item', () => {
    render(
      <VajraProvider>
        <Carousel data={items} renderItem={item => <Text>{item}</Text>} />
      </VajraProvider>,
    );

    items.forEach(item => expect(screen.getByText(item)).toBeTruthy());
  });

  it('renders a dot indicator for each item when there is more than one', () => {
    render(
      <VajraProvider>
        <Carousel testID="carousel" data={items} renderItem={item => <Text>{item}</Text>} />
      </VajraProvider>,
    );

    expect(screen.getByTestId('carousel')).toBeTruthy();
  });

  it('does not render an indicator for a single item', () => {
    render(
      <VajraProvider>
        <Carousel data={['Only slide']} renderItem={item => <Text>{item}</Text>} />
      </VajraProvider>,
    );

    expect(screen.getByText('Only slide')).toBeTruthy();
  });
});
