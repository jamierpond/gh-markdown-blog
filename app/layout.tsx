import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUsername } from "./shared";

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
      title: "madea.blog - Turn Your GitHub Repo Into a Beautiful Blog",
      description: "Transform your GitHub markdown files into a beautiful, fast blog. Zero configuration required. Just create a madea.blog repo and start writing.",
      keywords: ["blog", "github", "markdown", "static site", "blogging platform"],
      authors: [{ name: "madea.blog" }],
      openGraph: {
        type: "website",
        url: "https://madea.blog",
        title: "madea.blog - Turn Your GitHub Repo Into a Beautiful Blog",
        description: "Transform your GitHub markdown files into a beautiful, fast blog. Zero configuration required.",
        siteName: "madea.blog",
      },
      twitter: {
        card: "summary_large_image",
        title: "madea.blog - Turn Your GitHub Repo Into a Beautiful Blog",
        description: "Transform your GitHub markdown files into a beautiful, fast blog. Zero configuration required.",
        site: "@madeablog",
      },
    };
  }

  // Personalized metadata for user subdomains
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const userData = await response.json();
      const name = userData.name || username;
      const bio = userData.bio || `${name}'s blog powered by madea.blog`;
      const avatar = `https://github.com/${username}.png?size=1200`;
      const baseUrl = `https://${username}.madea.blog`;

      return {
        title: {
          default: `${name}'s Blog`,
          template: `%s - ${name}`,
        },
        description: bio,
        keywords: ["blog", "markdown", username, name],
        authors: [{ name, url: `https://github.com/${username}` }],
        creator: name,
        openGraph: {
          type: "website",
          url: baseUrl,
          title: `${name}'s Blog`,
          description: bio,
          siteName: `${name}'s Blog`,
          images: [
            {
              url: avatar,
              width: 1200,
              height: 1200,
              alt: name,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: `${name}'s Blog`,
          description: bio,
          images: [avatar],
          creator: `@${username}`,
          site: "@madeablog",
        },
      };
    }
  } catch {
    // Fallback if GitHub API fails
  }

  // Fallback metadata if API call fails
  return {
    title: {
      default: `${username}'s Blog`,
      template: `%s - ${username}`,
    },
    description: `${username}'s blog powered by madea.blog`,
    authors: [{ name: username, url: `https://github.com/${username}` }],
    openGraph: {
      type: "website",
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
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          {children}
      </body>
    </html>
  );
}
