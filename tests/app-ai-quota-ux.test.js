import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");

test("AI quota failures tell users the proxy is connected and local matches are preserved", () => {
  assert.match(appSource, /function describeAiFailure\(error, \{ localPreserved = false \} = \{\}\)/);
  assert.match(appSource, /minimax_quota_or_rate_limited/);
  assert.match(appSource, /代理已接通，但 MiniMax 上游返回额度不足或请求过于频繁；本地匹配已保留/);
  assert.match(appSource, /本地匹配结果已保留，可先按本地候选继续查看/);
  assert.match(appSource, /下一步：检查 MiniMax 控制台 Token Plan\/余额，充值后重试，或稍后再试/);
  assert.match(appSource, /MiniMax 额度或限流失败，本地结果已保留/);
});

test("recommendation, vision, and online search surfaces reuse the actionable AI failure copy", () => {
  assert.match(appSource, /describeAiFailure\(error, \{ localPreserved: true \}\)/);
  assert.match(appSource, /在线增强失败：\$\{feedback\.progress\}/);
  assert.match(appSource, /本地匹配 · \$\{feedback\.title\}/);
  assert.match(appSource, /图片识别未完成：\$\{feedback\.progress\}/);
  assert.match(appSource, /识别未完成 · \$\{feedback\.title\}/);
  assert.match(appSource, /仍可使用下方直接搜索/);
});

test("AI service status is updated after upstream quota, auth, or availability failures", () => {
  assert.match(appSource, /function showAiServiceFailure\(feedback\)/);
  assert.match(appSource, /elements\.aiServiceStatus\.textContent = feedback\.service/);
  assert.match(appSource, /代理已接通；MiniMax 上游额度不足或请求过于频繁/);
  assert.match(appSource, /showAiServiceFailure\(feedback\)/);
});
