/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = require('./csp')
const redirects = require('./redirects')

const nextConfig = {
  typescript: {
    // Ignore TypeScript build errors
    ignoreBuildErrors: true
  },
  reactStrictMode: true, // Enable React Strict Mode
  swcMinify: true, // Use SWC for minification
  images: {
    domains: ['localhost', process.env.NEXT_PUBLIC_SERVER_URL]
      .filter(Boolean) // Remove any falsy values from the array
      .map(url => url.replace(/https?:\/\//, '')), // Remove protocol from URL
  },
  redirects,
  async headers() {
    const headers = []

    // Prevent search engines from indexing the site if it is not live
    // Useful for staging environments before they are ready to go live
    if (!process.env.NEXT_PUBLIC_IS_LIVE) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      })
    }

    // Set the `Content-Security-Policy` header as a security measure to prevent XSS attacks
    headers.push({
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: ContentSecurityPolicy,
        },
      ],
    })

    return headers
  },
}

module.exports = nextConfig
