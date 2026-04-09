import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-[#f85149] bg-[#161b22] p-8 text-center">
          <span className="mb-4 text-4xl">⚠️</span>
          <h3 className="mb-2 text-lg font-semibold text-white">Something went wrong</h3>
          <p className="mb-4 text-sm text-gray-400">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm text-white transition hover:bg-[#30363d]"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
