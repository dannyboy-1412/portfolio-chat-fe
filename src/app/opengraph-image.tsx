import { ImageResponse } from 'next/og'

export const alt = 'Daniel A Rodrigues — Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%',
          padding: 80,
          background: '#09090b',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#a1a1aa', marginBottom: 16 }}>
          Software Engineer · Full Stack · Backend-focused
        </div>
        <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -1.5 }}>
          Daniel A Rodrigues
        </div>
        <div style={{ fontSize: 28, color: '#a1a1aa', marginTop: 20 }}>
          Document AI · Accounting agents · On-chain data
        </div>
      </div>
    ),
    { ...size }
  )
}
