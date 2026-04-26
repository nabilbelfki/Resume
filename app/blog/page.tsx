"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const postsPerPage = 9;

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

  const totalPages = Math.ceil(posts.length / postsPerPage) || 1;
  const startIndex = (currentPage - 1) * postsPerPage;
  const selectedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageInputValue((currentPage - 1).toString());
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageInputValue((currentPage + 1).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    let parsed = parseInt(pageInputValue, 10);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    if (parsed > totalPages) parsed = totalPages;
    setCurrentPage(parsed);
    setPageInputValue(parsed.toString());
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>Blog</div>
          <div className={styles.searchBar}>
            <input type="text" />
            <svg height="18" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.29873 0.00798784C0.974526 0.0488783 0.667847 0.200027 0.434918 0.432957C-0.00611577 0.87326 -0.124406 1.54138 0.138461 2.09852C0.355327 2.55926 0.789059 2.87763 1.28632 2.94334C1.65579 2.99153 2.0333 2.89661 2.3356 2.67974C2.37138 2.65419 2.4035 2.63301 2.40642 2.63301C2.40935 2.63301 2.65396 2.8747 2.94895 3.16897C3.51485 3.73487 3.51558 3.73487 3.58057 3.7356C3.61269 3.7356 3.67622 3.70931 3.69521 3.6874C3.71638 3.66331 3.73756 3.60927 3.73756 3.57861C3.73756 3.51362 3.73683 3.51289 3.17093 2.94699C2.87667 2.652 2.63497 2.40811 2.63497 2.40519C2.63497 2.40227 2.65615 2.37014 2.68244 2.33291C2.86352 2.07661 2.95553 1.79111 2.95626 1.48151C2.95626 1.08136 2.80292 0.711159 2.52033 0.430036C2.2969 0.208059 2.02235 0.0678632 1.70763 0.0152897C1.60833 -0.0015046 1.40242 -0.00515554 1.29873 0.00798784ZM1.64922 0.321969C1.98219 0.376002 2.26623 0.555629 2.44658 0.827258C2.58094 1.02952 2.64301 1.23178 2.64374 1.47201C2.64374 1.58811 2.6357 1.65821 2.60942 1.76409C2.50646 2.17518 2.17715 2.5045 1.76605 2.60746C1.66017 2.63374 1.59007 2.64177 1.47397 2.64177C1.23374 2.64104 1.03148 2.57898 0.829219 2.44462C0.507206 2.23068 0.312976 1.86778 0.312976 1.47713C0.312976 1.28144 0.353137 1.11641 0.44441 0.939707C0.591908 0.654204 0.854775 0.441719 1.17095 0.350446C1.30457 0.312476 1.51121 0.300063 1.64922 0.321969Z" fill="#8E93A3" />
            </svg>
          </div>
        </div>
        <div className={styles.blogs}>
          {selectedPosts.map((post, index) => (
            <a key={index} className={styles.blog} style={{ backgroundImage: `url(${post.thumbnail})` }} href={"./blog/" + [post._id]}>
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
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div onClick={prevPage} className={styles.arrow} style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}>
              <Image src="/images/left-arrow.svg" alt="Previous Page" width={10} height={18} />
            </div>
            <div className={styles.pageIndicator}>
              <span className={styles.pageLabel}>Page</span>
              <input 
                className={styles.pageInput} 
                value={pageInputValue}
                onChange={handleInputChange}
                onBlur={handleInputSubmit}
                onKeyDown={(e) => { if(e.key === 'Enter') handleInputSubmit(); }}
              />
            </div>
            <div onClick={nextPage} className={styles.arrow} style={{ opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}>
              <Image src="/images/right-arrow.svg" alt="Next Page" width={10} height={18} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;