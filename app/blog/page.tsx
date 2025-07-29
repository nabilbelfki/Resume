import React from "react";
// import QRCode from "../components/QRCode";
import styles from "./Blogs.module.css";


const Blogs: React.FC = () => {

  const blogs = [
    {
        title: "Unix Time Ending Soon",
        date: "April 5th, 2027",
        read: "12 minute read",
        category: "KERNEL",
        image: {
            path: "/images/blog-1.png",
            alt: "Picture of a Motherboard"
        }
    },
    {
        title: "5 Ways to Improve your Coding",
        date: "November 16th, 2026",
        read: "7 minute read",
        category: "SOFTWARE",
        image: {
            path: "/images/blog-2.png",
            alt: "Picture of Lines of Code"
        }
    }
];

  return (
    <div className={styles.container}>
      <div className={styles.title}>Blog</div>
      <div className={styles.blogs}>
        {blogs.map((blog, index) => (
          <div key={index} className={styles.blog} style={{backgroundImage: `url(${blog.image.path})`}}>
            <div className={styles.overlay}>
              <div className={styles[`blog-title`]}>{blog.title}</div>
              <div className={styles[`date-read-and-category`]}>
                <div className={styles[`date-and-read`]}>{blog.date} • {blog.read}</div>
                <div className={styles.category}>{blog.category}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
