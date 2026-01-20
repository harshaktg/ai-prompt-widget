import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Fallback UI to render when an error occurs */
  fallback?: ReactNode;
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching and handling React errors
 * Provides a graceful fallback UI when components crash
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    }

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            backgroundColor: 'var(--color-muted, #f3f4f6)',
            borderRadius: '8px',
            border: '1px dashed var(--color-border, #e5e7eb)',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: '#ef4444', marginBottom: '12px' }}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '4px',
              color: 'var(--color-foreground, #0a0a0a)',
            }}
          >
            Something went wrong
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-muted-foreground, #6b7280)',
              textAlign: 'center',
              maxWidth: '300px',
              marginBottom: '16px',
            }}
          >
            An unexpected error occurred while rendering this widget.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginBottom: '16px', width: '100%', maxWidth: '400px' }}>
              <summary
                style={{
                  fontSize: '11px',
                  cursor: 'pointer',
                  color: 'var(--color-muted-foreground, #6b7280)',
                }}
              >
                Show error details
              </summary>
              <pre
                style={{
                  marginTop: '8px',
                  fontSize: '10px',
                  overflow: 'auto',
                  maxHeight: '100px',
                  padding: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: 'var(--color-primary, #3a5ccc)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
