import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            background: '#0e131d',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            color: '#f8fafc',
            textAlign: 'center',
            margin: '20px auto',
            maxWidth: '500px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
          }}
        >
          <AlertTriangle size={42} color="#ef4444" style={{ marginBottom: 16 }} />
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              color: '#fff',
              marginBottom: 8,
              letterSpacing: '0.04em',
            }}
          >
            {this.props.fallbackTitle || 'FALHA DE PROCESSAMENTO BIOMÉTRICO'}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              color: '#94a3b8',
              marginBottom: 20,
              maxWidth: '380px',
            }}
          >
            Ocorreu uma inconsistência temporária na telemetria deste espécime.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(180deg, #c52033 0%, #880e1d 100%)',
              color: '#fff',
              border: '1.5px solid #fca5a5',
              borderRadius: '4px',
              padding: '8px 18px',
              fontFamily: 'var(--font-display)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            <RotateCcw size={15} />
            <span>REINICIAR TERMINAL</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
