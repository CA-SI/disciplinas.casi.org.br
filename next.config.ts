import type { NextConfig } from 'next'

// Site 100% estático (ADR 0002): `out/` é servido como assets de um Worker do Cloudflare.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
