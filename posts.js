import fs from "fs";
import Parser from "rss-parser";

const CRLF = "\r\n";
const BLOG_URL = "https://api.velog.io/rss/@wlgh1553";
const MAX_POSTS = 3;

async function getPosts() {
    const parser = new Parser();
    const posts = await parser.parseURL(BLOG_URL);
    return posts.items;
}

function buildContent({ title, isoDate, link }) {
    const LIST = "-";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const koreanDate = `${year}.${month}.${day}`;

    return `${LIST} [${title} (${koreanDate})](${link})`;
}

function buildContents(items) {
    return items.slice(0, MAX_POSTS).map(buildContent).join(CRLF);
}

async function updateReadme() {
    const [originReadme, items] = await Promise.all([
        fs.promises.readFile("README.md", "utf-8"),
        getPosts(),
    ]);

    const title = "### Latest Blog Posts";
    const posts = buildContents(items);

    const result = originReadme.split(title)[0] + CRLF + title + CRLF + posts;
    await fs.promises.writeFile("README.md", result, "utf-8");
}

updateReadme();
