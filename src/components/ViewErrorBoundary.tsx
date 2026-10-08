import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

// Catches anything a view throws -- a chunk that still failed after
// lazyWithReload's one reload, or a plain render bug -- so the sidebar stays
// and the user gets a way out, instead of React unmounting the whole app to
// a white page. App.tsx keys this by the current view, so moving to another
// tab clears the error.
interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ViewErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[view]', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.9rem', height: '60vh', textAlign: 'center', padding: '0 1rem' }}>
        <strong style={{ fontSize: '1.05rem', color: '#1a1a1a' }}>화면을 불러오지 못했어요</strong>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          사이트가 방금 업데이트됐거나 인터넷 연결이 불안정할 수 있어요.
          <br />
          새로고침하면 대부분 해결됩니다.
        </span>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          <RefreshCw size={14} />
          새로고침
        </button>
      </div>
    );
  }
}
