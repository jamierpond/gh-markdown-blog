import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getGithubUser, getUsername } from "./shared";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const username = await getUsername();

  // Default metadata for the root domain (madea.blog)
  if (!username) {
    return {
      metadataBase: new URL("https://madea.blog"),
      title: "madea.blog - Turn Your GitHub Repo Into a Beautiful Blog",
      description: "Transform your GitHub markdown files into a beautiful, fast blog. Zero configuration required. Just create a madea.blog repo and start writing.",
      keywords: ["blog", "github", "markdown", "static site", "blogging platform", "github pages", "markdown blog", "developer blog"],
      authors: [{ name: "madea.blog" }],
      creator: "madea.blog",
      publisher: "madea.blog",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://madea.blog",
        title: "madea.blog - Turn Your GitHub Repo Into a Beautiful Blog",
        description: "Transform your GitHub markdown files into a beautiful, fast blog. Zero configuration required.",
        siteName: "madea.blog",
        images: [
          {
            url: "https://madea.blog/og/madea-home",
            width: 1200,
            height: 630,
            alt: "madea.blog - Turn your GitHub markdown into a beautiful blog",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "madea.blog - Turn Your GitHub Repo Into a Beautiful Blog",
        description: "Transform your GitHub markdown files into a beautiful, fast blog. Zero configuration required.",
        site: "@madeablog",
        images: ["https://madea.blog/og/madea-home"],
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
      category: "technology",
    };
  }

  // Personalized metadata for user subdomains
  const baseUrl = `https://${username}.madea.blog`;

  const userData = await getGithubUser(username);

    if (userData) {
      const name = userData.name || username;
      const bio = userData.bio || `${name}'s blog powered by madea.blog`;
      const avatar = `https://github.com/${username}.png?size=1200`;
      const location = userData.location;
      const twitterUsername = userData.twitter_username;

      // Create dynamic OG image URL for user homepage
      const ogImageUrl = `${baseUrl}/og/user-home?name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&bio=${encodeURIComponent(bio)}&avatar=${encodeURIComponent(avatar)}`;

      return {
        metadataBase: new URL(baseUrl),
        title: {
          default: `${name}'s Blog`,
          template: `%s - ${name}`,
        },
        description: bio,
        keywords: ["blog", "markdown", username, name, "developer blog", "tech blog", "programming"],
        authors: [{ name, url: `https://github.com/${username}` }],
        creator: name,
        publisher: name,
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
        alternates: {
          types: {
            'application/rss+xml': `${baseUrl}/rss.xml`,
          },
        },
        openGraph: {
          type: "website",
          locale: "en_US",
          url: baseUrl,
          title: `${name}'s Blog`,
          description: bio,
          siteName: `${name}'s Blog`,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: `${name}'s Blog`,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: `${name}'s Blog`,
          description: bio,
          images: [ogImageUrl],
          creator: twitterUsername ? `@${twitterUsername}` : `@${username}`,
          site: "@madeablog",
        },
        ...(location && { other: { 'geo.region': location } }),
        category: "technology",
      };
    }
  

  // Fallback metadata if API call fails
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${username}'s Blog`,
      template: `%s - ${username}`,
    },
    description: `${username}'s blog powered by madea.blog`,
    authors: [{ name: username, url: `https://github.com/${username}` }],
    creator: username,
    publisher: username,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      types: {
        'application/rss+xml': `${baseUrl}/rss.xml`,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: `${username}'s Blog`,
      description: `${username}'s blog powered by madea.blog`,
      siteName: `${username}'s Blog`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${username}'s Blog`,
      description: `${username}'s blog powered by madea.blog`,
      creator: `@${username}`,
      site: "@madeablog",
    },
    category: "technology",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const username = await getUsername();
  let jsonLd = null;

  // Add JSON-LD structured data for user profiles
  if (username) {
    const userData = await getGithubUser(username);
      if (userData) {
        const name = userData.name || username;
        const bio = userData.bio;
        const avatar = `https://github.com/${username}.png`;
        const baseUrl = `https://${username}.madea.blog`;

        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: name,
          url: baseUrl,
          image: avatar,
          sameAs: [
            `https://github.com/${username}`,
            ...(userData.twitter_username ? [`https://twitter.com/${userData.twitter_username}`] : []),
            ...(userData.blog ? [userData.blog] : []),
          ],
          ...(bio && { description: bio }),
          ...(userData.location && { address: { '@type': 'PostalAddress', addressLocality: userData.location } }),
          jobTitle: 'Developer',
          worksFor: userData.company ? {
            '@type': 'Organization',
            name: userData.company.replace('@', ''),
          } : undefined,
        };
      }
    
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#9333ea" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          {children}
      </body>
    </html>
  );
}
