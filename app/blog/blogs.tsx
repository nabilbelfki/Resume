interface Blog {
    title: string;
    date: string;
    read: string;
    category: string;
    iamge: {
        path: string;
        alt: string;
    }
}

export const blogs = [
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
]