import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllPosts } from "../data/blogPosts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const allPosts = getAllPosts();

  useEffect(() => {
    // Background activation
    const updateActiveBackground = () => {
      const section = document.querySelector(".blog-post-bg");
      if (section) {
        section.classList.add("active");
      }
    };

    updateActiveBackground();
    window.addEventListener("scroll", updateActiveBackground);
    return () => window.removeEventListener("scroll", updateActiveBackground);
  }, []);

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | Nicholas Burgo</title>
        </Helmet>
        <section className="section-bg blog-post-bg min-h-screen py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-white/70 mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link
              to="/blog"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </section>
      </>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Find previous and next posts
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <>
      <Helmet>
        <title>{post.title} | Nicholas Burgo</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      <section className="section-bg blog-post-bg min-h-screen py-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog Link */}
          <Link
            to="/blog"
            className="inline-flex items-center text-white/70 hover:text-blue-300 mb-8 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span className="ml-2">Back to Blog</span>
          </Link>

          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-xl text-white/70 mb-6">{post.subtitle}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-6">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span key={tag} className="tech-tag text-xs px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </header>

          {/* Post Content */}
          <article className="blog-content prose prose-invert prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                {previousPost ? (
                  <Link
                    to={`/blog/${previousPost.slug}`}
                    className="group block p-4 project-card hover:border-blue-300 transition-colors"
                  >
                    <div className="text-sm text-white/60 mb-1">Previous Post</div>
                    <div className="text-white group-hover:text-blue-300 transition-colors font-semibold">
                      ← {previousPost.title}
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}
              </div>
              <div>
                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="group block p-4 project-card hover:border-blue-300 transition-colors text-right"
                  >
                    <div className="text-sm text-white/60 mb-1">Next Post</div>
                    <div className="text-white group-hover:text-blue-300 transition-colors font-semibold">
                      {nextPost.title} →
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

