import type {
  DataProvider,
  ArticleViewProps,
  FileBrowserViewProps,
  NoRepoFoundViewProps,
  LandingViewProps,
} from './data-provider.js';

/**
 * A generic type for view components being injected.
 * The component receives props P and returns a renderable element.
 * Since the core must be SSR-only and decoupled from React,
 * we use a generic function signature that returns unknown.
 * The actual React types are enforced in the consumer app.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MadeaView<P> = (props: P) => any;

/**
 * Configuration object for the madea-blog system.
 * This is the central configuration that provides both
 * the data provider instance and the user-defined view components.
 */
export interface Config {
  /** The data provider instance (GitHub, LocalFs, or custom) */
  dataProvider: DataProvider;

  /** The username/identifier for the blog owner */
  username: string;

  /** Component to render the file browser / article list */
  fileBrowserView: MadeaView<FileBrowserViewProps>;

  /** Component to render an individual article */
  articleView: MadeaView<ArticleViewProps>;

  /** Component to render when no repo is found */
  noRepoFoundView: MadeaView<NoRepoFoundViewProps>;

  /** Component to render the landing page (no subdomain) */
  landingView: MadeaView<LandingViewProps>;
}

/**
 * Result of the renderMadeaBlog controller function.
 * This is a discriminated union that tells the caller
 * which view to render and with what props.
 */
export type RenderedView =
  | {
      type: 'article';
      View: MadeaView<ArticleViewProps>;
      props: ArticleViewProps;
    }
  | {
      type: 'file-browser';
      View: MadeaView<FileBrowserViewProps>;
      props: FileBrowserViewProps;
    }
  | {
      type: 'no-repo-found';
      View: MadeaView<NoRepoFoundViewProps>;
      props: NoRepoFoundViewProps;
    }
  | {
      type: 'landing';
      View: MadeaView<LandingViewProps>;
      props: LandingViewProps;
    }
  | {
      type: '404';
    };

/**
 * Renders a RenderedView result to a React element.
 * Handles all view types internally so user code stays clean.
 *
 * @param result - The result from renderMadeaBlog
 * @param options - Optional handlers for special cases
 * @returns The rendered view element, or null for 404
 *
 * @example
 * ```tsx
 * const result = await renderMadeaBlog(config, path);
 * return renderPage(result) ?? notFound();
 * ```
 */
export function renderPage(
  result: RenderedView,
  options?: { onNotFound?: () => never }
): ReturnType<MadeaView<unknown>> | null {
  switch (result.type) {
    case 'article':
      return result.View(result.props);
    case 'file-browser':
      return result.View(result.props);
    case 'no-repo-found':
      return result.View(result.props);
    case 'landing':
      return result.View(result.props);
    case '404':
      if (options?.onNotFound) {
        options.onNotFound();
      }
      return null;
  }
}

/**
 * The main server-side controller function.
 * Takes the full config and a path, handles the logic,
 * and returns the appropriate view with its props.
 *
 * @param config - The full configuration object
 * @param path - The URL path (e.g., '/' for index, 'article.md' for an article)
 * @param options - Additional options
 * @returns The view to render with its props
 */
export async function renderMadeaBlog(
  config: Config,
  path: string,
  options: { hasUsername: boolean } = { hasUsername: true }
): Promise<RenderedView> {
  const {
    dataProvider,
    articleView,
    fileBrowserView,
    noRepoFoundView,
    landingView,
    username,
  } = config;

  // If no username (no subdomain), show landing page
  if (!options.hasUsername) {
    return {
      type: 'landing',
      View: landingView,
      props: {},
    };
  }

  // Root path - show file browser (article list)
  if (path === '/' || path === '') {
    try {
      const [articles, sourceInfo] = await Promise.all([
        dataProvider.getArticleList(),
        dataProvider.getSourceInfo(),
      ]);

      return {
        type: 'file-browser',
        View: fileBrowserView,
        props: {
          articles,
          sourceInfo,
          username,
        },
      };
    } catch {
      // Repo not found or error fetching
      return {
        type: 'no-repo-found',
        View: noRepoFoundView,
        props: {
          username,
        },
      };
    }
  }

  // Article path - show individual article
  try {
    const [article, branch] = await Promise.all([
      dataProvider.getArticle(path),
      dataProvider.getDefaultBranch(),
    ]);

    if (article) {
      return {
        type: 'article',
        View: articleView,
        props: {
          article,
          username,
          branch,
        },
      };
    }

    // Article not found
    return { type: '404' };
  } catch {
    return { type: '404' };
  }
}
