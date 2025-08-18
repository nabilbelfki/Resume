"use client";
import React, { useEffect, useState } from "react";
import styles from "./Blogs.module.css";

interface Post {
  _id: string;
  title: string;
  date: string;
  read: string;
  category: string;
  thumbnail: string;
}

const Blogs: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts`, {
          next: { revalidate: 60 },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Posts", data.data);
        setPosts(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [API_BASE_URL]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Blog</div>
      <div className={styles.blogs}>
        {posts.map((post, index) => (
          <a key={index} className={styles.blog} style={{backgroundImage: `url(${post.thumbnail})`}} href={"./blog/" + [post._id]}>
            <div className={styles.overlay}>
              <div className={styles[`blog-title`]}>{post.title}</div>
              <div className={styles[`date-read-and-category`]}>
                <div className={styles[`date-and-read`]}>{post.date} • {post.read}</div>
                <div className={styles.category}>{post.category}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Blogs;