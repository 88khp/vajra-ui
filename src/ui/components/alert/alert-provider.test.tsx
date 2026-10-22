import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react-native';
import { Animated, Button as RNButton } from 'react-native';
import { CheckCircleIcon } from '@88khp/vajra-icons';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { AlertProvider } from './alert-provider';
import { useAlert } from './alert-context';

jest.spyOn(Animated, 'timing').mockReturnValue({
  start: () => {},
  stop: () => {},
  reset: () => {},
} as unknown as Animated.CompositeAnimation);

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

const ShowButton = ({
  message,
  variant,
  duration,
}: {
  message: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}) => {
  const { show } = useAlert();

  return <RNButton title="show" onPress={() => show({ message, variant, duration })} />;
};

describe('AlertProvider / useAlert', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders no alert initially', () => {
    render(
      <VajraProvider>
        <AlertProvider>
          <ShowButton message="Saved" />
        </AlertProvider>
      </VajraProvider>,
    );

    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('shows an alert when show() is called', () => {
    render(
      <VajraProvider>
        <AlertProvider>
          <ShowButton message="Saved" />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });

    expect(screen.getByText('Saved')).toBeTruthy();
  });

  it('stays visible indefinitely by default (no auto-dismiss)', () => {
    render(
      <VajraProvider>
        <AlertProvider>
          <ShowButton message="Saved" />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });

    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    expect(screen.getByText('Saved')).toBeTruthy();
  });

  it('auto-dismisses after the given duration when set', () => {
    render(
      <VajraProvider>
        <AlertProvider>
          <ShowButton message="Saved" duration={1000} />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });
    expect(screen.getByText('Saved')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('stacks a second alert alongside the first instead of queuing behind it', () => {
    const ShowTwo = () => {
      const { show } = useAlert();

      return (
        <RNButton
          title="show-two"
          onPress={() => {
            show({ message: 'First' });
            show({ message: 'Second' });
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <AlertProvider>
          <ShowTwo />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show-two'));
    });

    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
  });

  it('defaults to showing at most 3 alerts at once, queuing the rest', () => {
    const ShowFour = () => {
      const { show } = useAlert();

      return (
        <RNButton
          title="show-four"
          onPress={() => {
            show({ message: 'One' });
            show({ message: 'Two' });
            show({ message: 'Three' });
            show({ message: 'Four' });
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <AlertProvider>
          <ShowFour />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show-four'));
    });

    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.getByText('Two')).toBeTruthy();
    expect(screen.getByText('Three')).toBeTruthy();
    expect(screen.queryByText('Four')).toBeNull();
  });

  it('promotes the next queued alert once a visible one is dismissed past maxVisible', () => {
    const ShowFourThenHideFirst = () => {
      const { show, hide } = useAlert();

      return (
        <RNButton
          title="show-four"
          onPress={() => {
            const firstId = show({ message: 'One' });

            show({ message: 'Two' });
            show({ message: 'Three' });
            show({ message: 'Four' });
            hide(firstId);
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <AlertProvider>
          <ShowFourThenHideFirst />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show-four'));
    });

    expect(screen.queryByText('One')).toBeNull();
    expect(screen.getByText('Four')).toBeTruthy();
  });

  it('respects a custom maxVisible prop', () => {
    const ShowThree = () => {
      const { show } = useAlert();

      return (
        <RNButton
          title="show-three"
          onPress={() => {
            show({ message: 'One' });
            show({ message: 'Two' });
            show({ message: 'Three' });
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <AlertProvider maxVisible={1}>
          <ShowThree />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show-three'));
    });

    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.queryByText('Two')).toBeNull();
    expect(screen.queryByText('Three')).toBeNull();
  });

  it('resolves the error variant to the theme errorSubtle background', () => {
    render(
      <VajraProvider>
        <AlertProvider>
          <ShowButton message="Failed" variant="error" />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });

    const style = flattenStyle(screen.getByTestId(/^alert-alert-[^-]+$/).props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.light.colors.errorSubtle);
  });

  it('renders the default variant icon without an explicit icon option', () => {
    render(
      <VajraProvider>
        <AlertProvider>
          <ShowButton message="Saved" variant="success" />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });

    expect(screen.UNSAFE_queryAllByType(CheckCircleIcon).length).toBe(1);
  });

  it('dismisses immediately when the dismiss button is pressed', () => {
    render(
      <VajraProvider>
        <AlertProvider>
          <ShowButton message="Saved" />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });
    expect(screen.getByText('Saved')).toBeTruthy();

    act(() => {
      fireEvent.press(screen.getByTestId(/^alert-alert-.+-dismiss$/));
    });
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('hide() dismisses an alert by id immediately', () => {
    const ShowAndHide = () => {
      const { show, hide } = useAlert();

      return (
        <RNButton
          title="show-and-hide"
          onPress={() => {
            const id = show({ message: 'Saved' });

            hide(id);
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <AlertProvider>
          <ShowAndHide />
        </AlertProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show-and-hide'));
    });

    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('throws when useAlert is used outside an AlertProvider', () => {
    const Bare = () => {
      useAlert();

      return null;
    };

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      render(
        <VajraProvider>
          <Bare />
        </VajraProvider>,
      ),
    ).toThrow('useAlert must be used within an AlertProvider');

    consoleError.mockRestore();
  });
});
