import fs from "fs";
import Parser from "rss-parser";

const CRLF = "\r\n";
const BLOG_URL = "https://api.velog.io/rss/@wlgh1553";
const MAX_POSTS = 3;
const FILTER_TITLE = '혼공머신'

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
    const koreanDate = [year, month.toString().padStart(2, '0'), day.toString().padStart(2, '0')].join('.');

    return `${LIST} [${title} (${koreanDate})](${link})`;
}

function buildContents(items) {
    return items.filter(({title}) => !title.includes(FILTER_TITLE)).slice(0, MAX_POSTS).map(buildContent).join(CRLF);
}

async function updateReadme() {
    const [originReadme, items] = await Promise.all([
        fs.promises.readFile("README.md", "utf-8"),
        getPosts(),
    ]);

    const title = "### Latest Blog Posts";
    const posts = buildContents(items);

    const result = [originReadme.split(title)[0], CRLF, title, posts]
        .map(str => str.trim())
        .join(CRLF);
    await fs.promises.writeFile("README.md", result, "utf-8");
}

updateReadme();
