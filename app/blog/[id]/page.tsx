"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { comment, Element as Block, ListItem, Checkbox } from "@/lib/types";
import styles from "./Post.module.css";
import Element from "@/components/Element/Element";
import Comments from "@/components/Comments/Comments";
import { useParams } from "next/navigation";
import { formatDate } from '@/lib/utilities';

interface Post {
  title: string;
  date: string;
  readTime: number;
  views?: number;
  category: string;
  status: "Draft" | "Published" | "Archived";
  visibility: "Public" | "Private" | null;
  content: Block[];
  comments: comment[];
  thumbnail: string;
  banner: string;
  slug: string;
  tags: string[];
}

type Comment = {
    name: string;
    text: string;
    date: string;
    time: string;
}

const Post: React.FC = () => {

    const params = useParams();
    const id = params?.id as string;
    const [post, setPost] = useState<Post>({
        title: '',
        readTime: 0,
        category: '',
        date: '',
        status: "Draft",
        visibility: 'Public',
        content: [],
        comments: [],
        thumbnail: '',
        banner: '',
        slug: '',
        tags: []
    });
    const [comments, setComments] = useState<comment[]>([]);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts/` + id, {
                next: { revalidate: 60 },
                });
        
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const post = await response.json();
                console.log("Posts", post);
                setPost(post);
                const comments = post.comments;
                setComments(comments);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchPost();
    }, [API_BASE_URL, id]);

  return (
    <div className={styles.container}>
        <Image src="/images/banner.jpg" alt="Post Banner Image" height={300} width={1200} />
        <div className={styles.post}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles[`date-read-time-and-category`]}>
                <div className={styles.date}>{formatDate(new Date(post.date))}</div>
                <div className={styles.bullet}>•</div>
                <div className={styles[`read-time`]}>{post.readTime + ' minute read'}</div>
                <div className={styles.category}>{post.category}</div>
            </div>
            {post.content.map((element, index) => 
                <Element key={'element_' + index} tag={element.tag} text={element.text} items={element.items as ListItem[]}  checkboxes={element.items as Checkbox[]}/>
            )}
        </div>
        <Comments post={id} comments={comments}/>
    </div>
  );
};

export default Post;
