import { useState, useEffect } from 'react';
import { MessageCircle, Plus, ArrowLeft, Send, Lock } from 'lucide-react';
import { useAuth, ADMIN_USER_ID } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface BoardPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: string;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function Board() {
  const { user } = useAuth();
  const isAdmin = user?.id === ADMIN_USER_ID;

  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'detail' | 'new'>('list');
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('board_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
      if (isAdmin) {
        const userIds = Array.from(new Set(data.map((p: BoardPost) => p.user_id)));
        if (userIds.length > 0) {
          const { data: profs } = await supabase.from('leaderboard_public').select('id, display_name').in('id', userIds);
          const map: Record<string, string> = {};
          (profs || []).forEach((p: any) => {
            map[p.id] = p.display_name;
          });
          setAuthorNames(map);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitNew = async () => {
    if (!newTitle.trim() || !newContent.trim() || !user || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from('board_posts').insert({
      user_id: user.id,
      title: newTitle.trim(),
      content: newContent.trim(),
    });
    setSubmitting(false);
    if (!error) {
      setNewTitle('');
      setNewContent('');
      setView('list');
      fetchPosts();
    }
  };

  const handleSubmitReply = async () => {
    if (!selectedPost || !replyText.trim() || submitting) return;
    setSubmitting(true);
    const { error } = await supabase
      .from('board_posts')
      .update({
        admin_reply: replyText.trim(),
        admin_reply_at: new Date().toISOString(),
        status: '답변완료',
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedPost.id);
    setSubmitting(false);
    if (!error) {
      setReplyText('');
      setView('list');
      setSelectedPost(null);
      fetchPosts();
    }
  };

  const openPost = (post: BoardPost) => {
    setSelectedPost(post);
    setReplyText(post.admin_reply || '');
    setView('detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '0.25rem', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageCircle size={22} />
          고객센터
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {isAdmin
            ? '전체 회원의 문의 내역이에요. 본인 계정 외 다른 회원의 글은 관리자만 볼 수 있어요.'
            : '작성한 문의는 본인과 관리자만 볼 수 있는 비밀글이에요. 궁금한 점을 편하게 남겨주세요.'}
        </p>
      </div>

      {view === 'list' && (
        <>
          {!isAdmin && (
            <button
              onClick={() => setView('new')}
              className="btn-primary"
              style={{ alignSelf: 'flex-start', padding: '0.65rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={15} />
              새 문의 작성
            </button>
          )}

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              불러오는 중...
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderRadius: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {isAdmin ? (
                '아직 접수된 문의가 없습니다.'
              ) : (
                <>
                  <Lock size={20} color="var(--text-muted)" />
                  <span style={{ fontWeight: '700', color: '#1a1a1a' }}>비밀 게시판입니다</span>
                  <span>본인이 작성한 문의만 여기에 표시돼요. 다른 회원의 글은 볼 수 없어요.</span>
                  <span>아직 작성한 문의가 없으니, 궁금한 점이 있으면 편하게 남겨보세요.</span>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => openPost(post)}
                  className="glass-card"
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '0px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                    <Lock size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </span>
                    {isAdmin && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                        {authorNames[post.user_id] || '알 수 없음'}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.55rem',
                        color: post.status === '답변완료' ? '#1a7f37' : '#9a6700',
                        background: post.status === '답변완료' ? '#dafbe1' : '#fff8e6',
                      }}
                    >
                      {post.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(post.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'new' && (
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '0px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={() => setView('list')}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <ArrowLeft size={14} />
            목록으로
          </button>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="glass-input"
            style={{ padding: '0.7rem 0.9rem', fontSize: '0.88rem' }}
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="문의 내용을 입력하세요"
            className="glass-input"
            style={{ padding: '0.9rem', fontSize: '0.85rem', minHeight: '220px', resize: 'vertical', fontFamily: 'inherit' }}
          />
          <button
            onClick={handleSubmitNew}
            disabled={!newTitle.trim() || !newContent.trim() || submitting}
            className="btn-primary"
            style={{ alignSelf: 'flex-end', padding: '0.65rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: !newTitle.trim() || !newContent.trim() ? 0.5 : 1 }}
          >
            <Send size={14} />
            {submitting ? '등록 중...' : '문의 등록'}
          </button>
        </div>
      )}

      {view === 'detail' && selectedPost && (
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '0px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <button
            onClick={() => {
              setView('list');
              setSelectedPost(null);
            }}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <ArrowLeft size={14} />
            목록으로
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a1a' }}>{selectedPost.title}</h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.55rem',
                  color: selectedPost.status === '답변완료' ? '#1a7f37' : '#9a6700',
                  background: selectedPost.status === '답변완료' ? '#dafbe1' : '#fff8e6',
                }}
              >
                {selectedPost.status}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isAdmin && `${authorNames[selectedPost.user_id] || '알 수 없음'} · `}
              {formatDate(selectedPost.created_at)}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#fafafa', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: '#1a1a1a', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {selectedPost.content}
          </div>

          {selectedPost.admin_reply && (
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                관리자 답변 {selectedPost.admin_reply_at && `· ${formatDate(selectedPost.admin_reply_at)}`}
              </div>
              <div style={{ padding: '1rem', background: '#f4fbf7', border: '1px solid #1a1a1a', fontSize: '0.85rem', color: '#1a1a1a', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {selectedPost.admin_reply}
              </div>
            </div>
          )}

          {isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {selectedPost.admin_reply ? '답변 수정' : '답변 작성'}
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="답변을 입력하세요"
                className="glass-input"
                style={{ padding: '0.9rem', fontSize: '0.85rem', minHeight: '140px', resize: 'vertical', fontFamily: 'inherit' }}
              />
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || submitting}
                className="btn-primary"
                style={{ alignSelf: 'flex-end', padding: '0.6rem 1.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: !replyText.trim() ? 0.5 : 1 }}
              >
                <Send size={14} />
                {submitting ? '등록 중...' : '답변 등록'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
