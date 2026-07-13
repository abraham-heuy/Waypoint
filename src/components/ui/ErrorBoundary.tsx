import { Component, type ReactNode } from 'react';
import Button from './Button';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-dispatch-bg text-dispatch-text">
          <div className="max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-2">Something went off-route.</h2>
            <p className="text-sm text-dispatch-dim mb-5">
              This section hit an unexpected error. Reloading usually fixes it.
            </p>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
