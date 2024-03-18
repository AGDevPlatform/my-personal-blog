import { Metadata } from "next";
import Image from "next/image";
import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import Giscus from "@giscus/react";
import Styles from "./style.module.css";
import Comments from "../../components/comments";
import { PostMetadata } from "@/components/PostMetadata";
import Head from "next/head";
import { NextSeo } from "next-seo";
import Link from "next/link";
export const metadata: Metadata = {
  title: "The Vi Blog",
  description: "This is my personal blog, sharing about my everyday life.",
};

const getPostMetadata = (tagSlug: string): PostMetadata[] => {
  const folder = "post/";
  if (!fs.existsSync(folder)) {
    // Handle the case where the folder doesn't exist
    console.error(`Folder '${folder}' does not exist.`);
    return [];
  }
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));
  const posts = markdownPosts
    .map((fileName) => {
      const fileContents = fs.readFileSync(`post/${fileName}`, "utf8");
      const matterResult = matter(fileContents);
      const tags = matterResult.data.tag || [];
      if (tags.includes(tagSlug)) {
        return {
          title: matterResult.data.title,
          tag: matterResult.data.tag,
          date: matterResult.data.date,
          subtitle: matterResult.data.subtitle,
          slug: fileName.replace(".md", ""),
        };
      }
      return null; // Nếu bài viết không có tag bằng slug, trả về null
    })
    .filter((post): post is PostMetadata => post !== null); // Lọc ra các bài viết không null
  return posts.sort((a, b) => {
    if (a && b) {
      const dateA = new Date(a.date.split("-").reverse().join("-"));
      const dateB = new Date(b.date.split("-").reverse().join("-"));
      return dateB.getTime() - dateA.getTime(); // Sắp xếp giảm dần, bài đăng mới nhất sẽ đứng trước
    }
    return 0;
  });
};

export default function Tags(props: any) {
  const slug = props.params.slug;
  const postMetadata = getPostMetadata(slug);
  const postPreviews = postMetadata.map((post) => (
    // eslint-disable-next-line react/jsx-key

    <div key={post.slug}>
      <div className="flex flex-col w-full border  hover:bg-slate-50 rounded p-4 mb-4 hover:shadow-sm">
        <span className="font-bold gradient-text">
          {" "}
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </span>
        <span className="text-sm text-slate-400 mt-2">{post.subtitle}</span>
        <div className="mt-auto">
          <time className="text-sm text-slate-400">🕖 {post.date}</time>
        </div>
      </div>
    </div>
  ));
  return (
    <div>
      <div className="overflow-hidden">
        <h4 className="  text-2xl font-medium text-gray-700 mb-5" id="new">
          #
        </h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          {postPreviews}
        </div>{" "}
      </div>
    </div>
  );
}
