import React from "react";
import Image from "next/image";
import { comment } from "@/lib/types";
import styles from "./Post.module.css";
import Element from "@/components/Element/Element";
import Comments from "@/components/Comments/Comments";


const Post: React.FC = () => {

    const post = {
        title: "Why Visual Studio Code is the Best IDE",
        date: "September 8th, 2026",
        readTime: 3,
        category: "SOFTWARE",
        content: [
            {tag: "p", text: "Sure, there are a plethora of Integrated Development Environments (IDEs) out there, from the language-specific powerhouses like Eclipse for Java and Xcode for Swift to more general-purpose editors. But when it comes to striking the perfect balance between power, flexibility, and a truly enjoyable coding experience, Visual Studio Code (VS Code)reigns supreme. It's not just an editor; it's a meticulously crafted development hub that consistently outperforms its competitors."},
            {tag: "h2", text: "Lightweight Powerhouse ⚡"},
            {tag: "p", text: "One of the most immediate and impactful advantages of VS Code is its lightweight nature. Unlike many full-blown IDEs that can feel sluggish and consume vast amounts of system resources, VS Code is incredibly fast and responsive. It boots up in seconds, handles large projects with ease, and won't drag your system to a halt. This efficiency translates directly into a smoother, more productive workflow, especially for developers who frequently switch between projects or work on less powerful machines."},
            {tag: "h2", text: "Unmatched Customization and Extensibility 🎨"},
            {tag: "p", text: `VS Code's true magic lies in its unparalleled customization and extensibility. While it comes with excellent out-of-the-box support for many languages, particularly web technologies like JavaScript, TypeScript, and Node.js, its true strength comes from its vast marketplace of extensions.

            Want to code in Python, C++, Go, or Ruby? There's an extension for that, and likely a highly-rated, well-maintained one. These extensions transform VS Code from a mere text editor into a full-fledged IDE for virtually any language or framework. You can tailor themes, icons, keybindings, and settings to create an environment that feels uniquely yours. This flexibility means you're not locked into a single ecosystem; VS Code adapts to your needs, not the other way around.`},
            {tag: "h2", text: "Integrated Development Features 🛠️"},
            {tag: "p", text: `Despite its lightweight core, VS Code packs in essential IDE features that make development a breeze:

            IntelliSense: This intelligent code completion system offers smart suggestions based on context, significantly speeding up coding and reducing errors.
            Built-in Debugger: Say goodbye to endless print statements. VS Code's integrated debugger allows you to set breakpoints, inspect variables, and step through your code effortlessly, making bug hunting far less painful.
            Seamless Git Integration: Version control is crucial for any developer, and VS Code's native Git support is top-notch. You can manage commits, branches, and resolve conflicts directly within the editor, streamlining your collaborative workflow.
            Integrated Terminal: No more switching between applications. A built-in terminal provides quick access to your command line, allowing you to run scripts, build projects, and interact with your environment without leaving VS Code.`},
            {tag: "h2", text: "Cross-Platform Compatibility 🌍"},
            {tag: "p", text: "Whether you're on Windows, macOS, or Linux, VS Code works seamlessly across all major operating systems. This cross-platform compatibility is a huge boon for teams with diverse setups or for developers who switch between machines. Your personalized setup and extensions can sync across your devices, ensuring a consistent development environment wherever you are."},
            {tag: "h2", text: "A Thriving Community 🤝"},
            {tag: "p", text: `Behind VS Code is a massive, active, and supportive community. This means:

            Constant Innovation: New features and improvements are rolled out regularly.
            Rich Extension Ecosystem: As mentioned, if you can imagine a coding need, there's probably an extension for it.
            Abundant Resources: Tutorials, forums, and community-driven content are readily available, making it easy to learn and troubleshoot.`},
            {tag: "h2", text: "Conclusion ✨"},
            {tag: "p", text: "While specialized IDEs certainly have their place for deep-dive development in specific languages, for the vast majority of coding tasks and for developers who work across multiple technologies, Visual Studio Code stands out. Its combination of speed, incredible customization, powerful integrated features, and cross-platform support makes it the undisputed champion of modern IDEs. If you haven't given it a proper try, you're missing out on a truly transformative development experience."},
        ] 
    };

    const comments: comment[] = [
        {
            name: "Josh Pocano",
            date: "07/23/2025",
            text: "Hey Nabil love the blog post dude. I totally agree Visual Studio Code is definitely the most versatile IDE and the best one in my opinion too! I really liked your comparison section, it went into great detail and was an thorough breakdown. I will say though that I think that xCode is the most compatible browser because it won the award for the past three years in a row and supports Swift, Kotlin and all mobile languages, so I will have to disagree with you on that part.",
            time: "12:32PM"
        },
        {
            name: "Cindy Ming",
            date: "07/22/2025",
            text: "Hey Nabil love the blog post dude. I totally agree Visual Studio Code is definitely the most versatile IDE and the best one in my opinion too! I really liked your comparison section, it went into great detail and was an thorough breakdown. I will say though that I think that xCode is the most compatible browser because it won the award for the past three years in a row and supports Swift, Kotlin and all mobile languages, so I will have to disagree with you on that part.",
            time: "3:58PM"
        },
        {
            name: "Michael Resello",
            date: "12/16/2024",
            text: "Hey Nabil love the blog post dude. I totally agree Visual Studio Code is definitely the most versatile IDE and the best one in my opinion too! I really liked your comparison section, it went into great detail and was an thorough breakdown. I will say though that I think that xCode is the most compatible browser because it won the award for the past three years in a row and supports Swift, Kotlin and all mobile languages, so I will have to disagree with you on that part.",
            time: "11:11AM"
        }
    ]

  return (
    <div className={styles.container}>
        <Image src="/images/banner.jpg" alt="Post Banner Image" height={300} width={1200} />
        <div className={styles.post}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles[`date-read-time-and-category`]}>
                <div className={styles.date}>{post.date}</div>
                <div className={styles.bullet}>•</div>
                <div className={styles[`read-time`]}>{post.readTime + ' minute read'}</div>
                <div className={styles.category}>{post.category}</div>
            </div>
            {post.content.map((element, index) => 
                <Element key={'element_' + index} tag={element.tag} text={element.text} />
            )}
        </div>
        <Comments comments={comments}/>
    </div>
  );
};

export default Post;
