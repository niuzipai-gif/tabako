import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  applyManualMediaOverrides,
  buildManualMediaBackup,
  normalizeManualMediaBackup,
} from "../manual-media-overrides.js";

const product = {
  id: "p-001",
  jp: "テスト スモーク",
  cn: "测试烟",
  image: "./images/original-pack.jpg",
  imageStatus: "verified",
  imageSource: "https://example.com/original",
  imageNote: "原始图片已核对",
  cartonStatus: "verified",
  cartonImage: "./images/original-carton.jpg",
  cartonSource: "https://example.com/carton",
};

test("manual pack overrides update display media without changing carton evidence", () => {
  const [updated] = applyManualMediaOverrides([product], new Map([
    [
      "p-001",
      {
        id: "p-001",
        kind: "pack",
        dataUrl: "data:image/webp;base64,PACK",
        width: 800,
        height: 600,
        bytes: 1234,
        updatedAt: "2026-08-05T00:00:00.000Z",
      },
    ],
  ]));

  assert.equal(updated.image, "data:image/webp;base64,PACK");
  assert.equal(updated.imageStatus, "manual-local");
  assert.match(updated.imageNote, /当前浏览器/);
  assert.equal(updated.cartonStatus, "verified");
  assert.equal(updated.cartonImage, "./images/original-carton.jpg");
  assert.equal(updated.cartonSource, "https://example.com/carton");
});

test("manual carton overrides stay non-verified local references", () => {
  const [updated] = applyManualMediaOverrides([product], new Map([
    [
      "p-001",
      {
        id: "p-001",
        kind: "carton",
        dataUrl: "data:image/webp;base64,CARTON",
        width: 800,
        height: 600,
        bytes: 4321,
        updatedAt: "2026-08-05T00:00:00.000Z",
      },
    ],
  ]));

  assert.equal(updated.cartonImage, "data:image/webp;base64,CARTON");
  assert.equal(updated.cartonStatus, "manual-local-reference");
  assert.match(updated.cartonNote, /不会标记 verified/);
});

test("manual backup export includes static-site warning and commit-ready patch instructions", () => {
  const backup = buildManualMediaBackup({
    products: [product],
    overrides: new Map([
      [
        "p-001",
        {
          id: "p-001",
          kind: "pack",
          dataUrl: "data:image/webp;base64,PACK",
          width: 800,
          height: 600,
          bytes: 1234,
          updatedAt: "2026-08-05T00:00:00.000Z",
        },
      ],
    ]),
    now: new Date("2026-08-05T01:02:03.000Z"),
  });

  assert.equal(backup.version, 1);
  assert.match(backup.warning, /GitHub Pages 是静态站/);
  assert.match(backup.warning, /不会上传到 GitHub/);
  assert.match(backup.commitInstructions, /data\/manual-media-overrides.json/);
  assert.match(backup.patchText, /manual-local/);
  assert.equal(backup.overrides[0].productId, "p-001");
  assert.equal(backup.overrides[0].kind, "pack");
});

test("manual backup import rejects attempts to forge verified evidence", () => {
  const payload = {
    version: 1,
    exportedAt: "2026-08-05T01:02:03.000Z",
    overrides: [
      {
        productId: "p-001",
        kind: "carton",
        dataUrl: "data:image/webp;base64,CARTON",
        status: "verified",
        cartonStatus: "verified",
      },
    ],
  };

  assert.throws(
    () => normalizeManualMediaBackup(payload, new Set(["p-001"])),
    /verified/i,
  );
});

test("manual media manager exposes pack and carton maintenance with static export controls", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");

  assert.match(html, /id="imageManagerDialog"/);
  assert.match(html, /name="imageManagerKind"\s+value="pack"/);
  assert.match(html, /name="imageManagerKind"\s+value="carton"/);
  assert.match(html, /id="imageManagerPatch"/);
  assert.match(html, /GitHub Pages 是静态网页/);
  assert.match(appSource, /indexedDB\.open\(USER_IMAGE_DB/);
  assert.match(appSource, /buildManualMediaBackup/);
  assert.match(appSource, /normalizeManualMediaBackup/);
  assert.match(appSource, /imageManagerExport\??\.addEventListener/);
  assert.match(appSource, /imageManagerImport\??\.addEventListener/);
});
