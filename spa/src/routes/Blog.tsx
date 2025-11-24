import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getAllPosts } from "../data/blogPosts";

export default function Blog() {
  const posts = getAllPosts();

  useEffect(() => {
    // Background activation
    const updateActiveBackground = () => {
      const section = document.querySelector(".blog-bg");
      if (section) {
        section.classList.add("active");
      }
    };

    updateActiveBackground();
    window.addEventListener("scroll", updateActiveBackground);
    return () => window.removeEventListener("scroll", updateActiveBackground);
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog | Nicholas Burgo</title>
        <meta
          name="description"
          content="Notes on AI, game dev, and building things as a CS student"
        />
      </Helmet>
      <section className="section-bg blog-bg min-h-screen py-24 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-down">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
              Blog
            </h1>
            <p className="text-xl text-white/70">
              Notes on AI, game dev, and building things as a CS student
            </p>
          </div>

          {/* Blog Posts List */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-white/60 text-lg">No posts yet. Check back soon!</p>
              </div>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="blog-card block"
                >
                  <article className="project-card p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 hover:text-blue-300 transition-colors">
                          {post.title}
                        </h2>
                        {post.subtitle && (
                          <p className="text-lg text-white/70 mb-3">
                            {post.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-white/60">
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="tech-tag text-xs px-3 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-white/80 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center text-blue-300 font-semibold group">
                      <span className="group-hover:translate-x-2 transition-transform">
                        Read more →
                      </span>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}


