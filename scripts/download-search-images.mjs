import fs from "node:fs/promises";
import path from "node:path";
import { rawProducts } from "../data/products.js";

const projectRoot = process.cwd();
const imagesDir = path.join(projectRoot, "images");

function imgKeyFromNames(jp, cn) {
  const s = `${jp}|${cn}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h >>> 0, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildQuery(product) {
  if (product.type === "cigarette") return `${product.jp} cigarette pack`;
  if (product.type === "heated") return `${product.jp} heated tobacco pack`;
  if (product.type === "device") return `${product.jp} IQOS device`;
  return `${product.jp} vape pod`;
}

async function getJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
}

async function getText(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

async function resolveImageUrl(query) {
  const encoded = encodeURIComponent(query);
  const searchPage = await getText(`https://duckduckgo.com/?q=${encoded}&iax=images&ia=images`);
  const vqdMatch = searchPage.match(/vqd="([^"]+)"/);

  if (!vqdMatch) {
    throw new Error(`Missing vqd token for query: ${query}`);
  }

  const apiUrl = `https://duckduckgo.com/i.js?l=jp-jp&o=json&q=${encoded}&vqd=${encodeURIComponent(vqdMatch[1])}&p=1`;
  const data = await getJson(apiUrl, { referer: "https://duckduckgo.com/" });
  const first = data?.results?.[0];

  if (!first?.thumbnail && !first?.image) {
    throw new Error(`No image results for query: ${query}`);
  }

  return {
    imageUrl: first.thumbnail || first.image,
    sourcePage: first.url || "",
    title: first.title || "",
  };
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0", referer: "https://duckduckgo.com/" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while downloading ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
}

async function main() {
  await fs.mkdir(imagesDir, { recursive: true });
  const products = rawProducts;
  const manifestPath = path.join(imagesDir, "manifest.json");
  let existingManifest = [];
  try {
    const manifestSource = (await fs.readFile(manifestPath, "utf8")).replace(/^\uFEFF/, "");
    existingManifest = JSON.parse(manifestSource);
  } catch {}
  const existingByKey = new Map(existingManifest.map((item) => [item.key, item]));
  const manifest = [];

  for (const product of products) {
    const key = imgKeyFromNames(product.jp, product.cn);
    const outputPath = path.join(imagesDir, `${key}.jpg`);
    const query = buildQuery(product);

    try {
      await fs.access(outputPath);
      manifest.push({
        ...(existingByKey.get(key) ?? {}),
        type: product.type,
        jp: product.jp,
        cn: product.cn,
        key,
        query,
        status: "exists",
      });
      continue;
    } catch {}

    try {
      const result = await resolveImageUrl(query);
      await downloadImage(result.imageUrl, outputPath);
      manifest.push({
        type: product.type,
        jp: product.jp,
        cn: product.cn,
        key,
        query,
        status: "downloaded",
        imageUrl: result.imageUrl,
        sourcePage: result.sourcePage,
        title: result.title,
      });
      console.log(`downloaded ${product.jp} -> ${key}.jpg`);
    } catch (error) {
      manifest.push({
        type: product.type,
        jp: product.jp,
        cn: product.cn,
        key,
        query,
        status: "failed",
        error: error.message,
      });
      console.error(`failed ${product.jp}: ${error.message}`);
    }

    await sleep(1200);
  }

  await fs.writeFile(
    manifestPath,
    `\uFEFF${JSON.stringify(manifest, null, 4)}\n`,
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
