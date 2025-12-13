import { NextResponse } from 'next/server';
import { GITHUB_TOKEN } from '@/app/shared';

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  stargazers_count: number;
  updated_at: string;
  owner: {
    login: string;
  };
}

interface GitHubSearchResponse {
  items: GitHubRepo[];
}

export async function GET() {
  try {
    // Search for all repositories with the exact name "madea.blog"
    const searchQuery = 'madea.blog in:name';
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&per_page=100`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json() as GitHubSearchResponse;

    // Filter to exact matches only (case-insensitive)
    const exactMatches = data.items.filter(
      (repo: GitHubRepo) => repo.name.toLowerCase() === 'madea.blog'
    );

    // Return simplified data
    const blogs = exactMatches.map((repo: GitHubRepo) => ({
      owner: repo.owner.login,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      defaultBranch: repo.default_branch,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    }));

    return NextResponse.json({
      total: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error('Error fetching madea.blog repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
