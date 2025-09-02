import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Message } from 'primereact/message'
import { MCPLogger } from '@/lib/mcp'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary component for handling and displaying errors gracefully
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    MCPLogger.error('ErrorBoundary', error, {
      componentStack: errorInfo.componentStack
    })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-4">
          <Message
            severity="error"
            text="Something went wrong. Please try again or contact support if the problem persists."
          />
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
