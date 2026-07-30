const params = new URLSearchParams(window.location.search);
const queryProxyUrl = params.get("aiProxyUrl") || "";
const defaultProxyUrl = "https://qx-20230328ddry.tail74d566.ts.net/tabako-ai";

function storedProxyUrl(nextValue = "") {
  try {
    if (nextValue) window.localStorage?.setItem("TABAKO_AI_PROXY_URL", nextValue);
    return window.localStorage?.getItem("TABAKO_AI_PROXY_URL") || "";
  } catch {
    return "";
  }
}

const savedProxyUrl = storedProxyUrl(queryProxyUrl);

window.TABAKO_CONFIG = Object.freeze({
  aiProxyUrl: queryProxyUrl || savedProxyUrl || defaultProxyUrl,
});
