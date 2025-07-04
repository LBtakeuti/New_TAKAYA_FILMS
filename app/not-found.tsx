export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Noto Sans JP, sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: '300', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>ページが見つかりません</p>
      <a href="/" style={{ 
        marginTop: '2rem', 
        color: '#000',
        textDecoration: 'none',
        padding: '10px 20px',
        border: '1px solid #000',
        borderRadius: '4px',
        transition: 'all 0.3s ease'
      }}>
        ホームに戻る
      </a>
    </div>
  );
}