import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  moduleName: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ModuleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[ModuleErrorBoundary] Error in module "${this.props.moduleName}":`,
      error,
      errorInfo,
    );
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-300 bg-red-50 p-8 text-center">
          <p className="mb-1 text-sm font-medium text-red-800">
            Failed to load <strong>{this.props.moduleName}</strong>
          </p>
          <p className="mb-4 text-xs text-red-600">
            {this.state.error?.message}
          </p>
          <button
            onClick={this.handleRetry}
            className="rounded-md bg-red-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
