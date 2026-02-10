"use client";

import React, { Component, ReactNode } from 'react';
import ErrorState from './ErrorState';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console (future-ready for telemetry)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    // Reload the page as a recovery option
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title="Something went wrong"
          message="An unexpected error occurred. Please try reloading the page."
          action={
            <button
              onClick={this.handleReload}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          }
          variant="error"
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
