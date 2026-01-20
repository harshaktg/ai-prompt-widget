/**
 * DevModeBanner Component
 * Shown when widget is running in standalone/development mode
 */

export function DevModeBanner() {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '12px 20px',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
            fontSize: '13px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <span style={{ fontSize: '18px' }}>🔧</span>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                    Development Mode
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                    Using mock data. Deploy to Automation Engine to use real data.
                </div>
            </div>
            <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 500
            }}>
                STANDALONE
            </div>
        </div>
    );
}
