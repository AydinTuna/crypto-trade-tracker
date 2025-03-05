import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: '#1E293B',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    color: 'white',
                }}
            >
                <svg width="180" height="180" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                    </defs>
                    <rect width="512" height="512" rx="128" fill="#1E293B" />
                    <g transform="translate(96, 96) scale(0.625)">
                        <path d="M256 32C138.2 32 32 138.2 32 256s106.2 224 224 224 224-106.2 224-224S373.8 32 256 32zm0 400c-97 0-176-79-176-176S159 80 256 80s176 79 176 176-79 176-176 176z" fill="url(#gradient)" />
                        <path d="M304 256c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48z" fill="white" />
                        <path d="M325.8 186.2c-16.5-16.5-38.4-25.6-61.8-25.6-23.3 0-45.3 9.1-61.8 25.6-16.5 16.5-25.6 38.4-25.6 61.8s9.1 45.3 25.6 61.8c16.5 16.5 38.4 25.6 61.8 25.6 23.3 0 45.3-9.1 61.8-25.6 16.5-16.5 25.6-38.4 25.6-61.8s-9.1-45.3-25.6-61.8zm-61.8 117.4c-30.6 0-55.6-25-55.6-55.6s25-55.6 55.6-55.6 55.6 25 55.6 55.6-25 55.6-55.6 55.6z" fill="url(#gradient)" />
                        <path d="M256 128v48M256 336v48M128 256h48M336 256h48" stroke="url(#gradient)" strokeWidth="32" strokeLinecap="round" />
                    </g>
                </svg>
            </div>
        ),
        { ...size }
    );
} 