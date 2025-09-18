// src/components/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // you can send to logging service here
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-3xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 glass">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-white/80 mb-4">
              An unexpected error happened while rendering the page. We've logged the details to the console.
            </p>
            <details className="text-xs whitespace-pre-wrap max-h-48 overflow-auto text-white/70">
              {this.state.error && this.state.error.toString()}
              {this.state.info && "\n\n" + (this.state.info.componentStack || "")}
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
