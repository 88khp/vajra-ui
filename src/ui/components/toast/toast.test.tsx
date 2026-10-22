import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react-native';
import { Animated, Button as RNButton } from 'react-native';
import { CheckCircleIcon } from '@88khp/vajra-icons';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { ToastProvider } from './toast-provider';
import { useToast } from './toast-context';

// ToastProvider fades its container via Animated.timing with
// useNativeDriver: true, which this test environment's react-native /
// react-test-renderer combo can't connect to. Stub it, same pattern used
// elsewhere in this repo's test suite (icon-switch, modal, sheet).
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
  const { show } = useToast();

  return <RNButton title="show" onPress={() => show({ message, variant, duration })} />;
};

describe('ToastProvider / useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders no toast initially', () => {
    render(
      <VajraProvider>
        <ToastProvider>
          <ShowButton message="Saved" />
        </ToastProvider>
      </VajraProvider>,
    );

    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('shows a toast when show() is called', () => {
    render(
      <VajraProvider>
        <ToastProvider>
          <ShowButton message="Saved" />
        </ToastProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });

    expect(screen.getByText('Saved')).toBeTruthy();
  });

  it('auto-dismisses after the given duration', () => {
    render(
      <VajraProvider>
        <ToastProvider>
          <ShowButton message="Saved" duration={1000} />
        </ToastProvider>
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

  it('stacks a second toast alongside the first instead of queuing behind it', () => {
    const ShowTwo = () => {
      const { show } = useToast();

      return (
        <RNButton
          title="show-two"
          onPress={() => {
            show({ message: 'First', duration: 500 });
            show({ message: 'Second', duration: 500 });
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <ToastProvider>
          <ShowTwo />
        </ToastProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show-two'));
    });

    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.queryByText('First')).toBeNull();
    expect(screen.queryByText('Second')).toBeNull();
  });

  it('defaults to showing at most 3 toasts at once, queuing the rest', () => {
    const ShowFour = () => {
      const { show } = useToast();

      return (
        <RNButton
          title="show-four"
          onPress={() => {
            show({ message: 'One', duration: 0 });
            show({ message: 'Two', duration: 0 });
            show({ message: 'Three', duration: 0 });
            show({ message: 'Four', duration: 0 });
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <ToastProvider>
          <ShowFour />
        </ToastProvider>
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

  it('promotes the next queued toast once a visible one is dismissed past maxVisible', () => {
    const ShowFourThenHideFirst = () => {
      const { show, hide } = useToast();

      return (
        <RNButton
          title="show-four"
          onPress={() => {
            const firstId = show({ message: 'One', duration: 0 });

            show({ message: 'Two', duration: 0 });
            show({ message: 'Three', duration: 0 });
            show({ message: 'Four', duration: 0 });
            hide(firstId);
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <ToastProvider>
          <ShowFourThenHideFirst />
        </ToastProvider>
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
      const { show } = useToast();

      return (
        <RNButton
          title="show-three"
          onPress={() => {
            show({ message: 'One', duration: 0 });
            show({ message: 'Two', duration: 0 });
            show({ message: 'Three', duration: 0 });
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <ToastProvider maxVisible={1}>
          <ShowThree />
        </ToastProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show-three'));
    });

    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.queryByText('Two')).toBeNull();
    expect(screen.queryByText('Three')).toBeNull();
  });

  it('resolves the error variant to the theme error color', () => {
    render(
      <VajraProvider>
        <ToastProvider>
          <ShowButton message="Failed" variant="error" />
        </ToastProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });

    const style = flattenStyle(screen.getByTestId(/^toast-toast-/).props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.light.colors.error);
  });

  it('renders the default variant icon without an explicit icon option', () => {
    render(
      <VajraProvider>
        <ToastProvider>
          <ShowButton message="Saved" variant="success" />
        </ToastProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });

    expect(screen.UNSAFE_queryAllByType(CheckCircleIcon).length).toBe(1);
  });

  it('does not render a dismiss button when dismissible is not set', () => {
    render(
      <VajraProvider>
        <ToastProvider>
          <ShowButton message="Saved" />
        </ToastProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });

    expect(screen.queryByTestId(/^toast-toast-.+-dismiss$/)).toBeNull();
  });

  it('dismisses immediately when the dismiss button is pressed', () => {
    const ShowDismissible = () => {
      const { show } = useToast();

      return (
        <RNButton
          title="show"
          onPress={() => show({ message: 'Saved', duration: 0, dismissible: true })}
        />
      );
    };

    render(
      <VajraProvider>
        <ToastProvider>
          <ShowDismissible />
        </ToastProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show'));
    });
    expect(screen.getByText('Saved')).toBeTruthy();

    act(() => {
      fireEvent.press(screen.getByTestId(/^toast-toast-.+-dismiss$/));
    });
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('hide() dismisses a toast by id immediately', () => {
    const ShowAndHide = () => {
      const { show, hide } = useToast();

      return (
        <RNButton
          title="show-and-hide"
          onPress={() => {
            const id = show({ message: 'Saved', duration: 0 });

            hide(id);
          }}
        />
      );
    };

    render(
      <VajraProvider>
        <ToastProvider>
          <ShowAndHide />
        </ToastProvider>
      </VajraProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByText('show-and-hide'));
    });

    expect(screen.queryByText('Saved')).toBeNull();
  });
});
