// Next.js App Router dynamic robots.txt generator
// Generates https://soulmatelove.in/robots.txt

export default function robots() {
  const baseUrl = 'https://soulmatelove.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/chat/', '/dashboard/', '/profile/', '/create-avatar/', '/upgrade/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
