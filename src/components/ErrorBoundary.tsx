import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children?: ReactNode;
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
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-8 text-center font-mono">
           <div className="max-w-md border border-red-900 bg-red-950/30 p-8 rounded-lg">
               <h1 className="text-xl font-bold mb-4 text-red-500 uppercase tracking-widest">System Failure</h1>
               <p className="mb-6 text-red-200/70 text-sm">{this.state.error?.message || "An unexpected error occurred in the time stream."}</p>
               <button 
                   onClick={() => window.location.reload()}
                   className="px-6 py-3 bg-red-900/50 text-red-100 border border-red-800 hover:bg-red-800 transition-colors uppercase text-xs tracking-widest"
               >
                   Reboot Protocol
               </button>
           </div>
       </div>
      );
    }

    return this.props.children;
  }
}