// api 请求和文件下载

import { timelineTypes } from "./type";

// 获取用户所有吐槽时间线数据
const baseUrl = "https://next.bgm.tv/p1";
const proxyUrl = "https://proxy.lain.today/";
const limit = 20;

export async function getAllTsukomiTimelines(username) {
  const apiUrl = `${proxyUrl}${baseUrl}/users/${username}/timeline`;
  let lastId = null;
  let hasMore = true;
  let allTimelines = [];
  try {
    while (hasMore) {
      let url = `${apiUrl}?limit=${limit}`;
      if (lastId !== null) {
        url += `&until=${lastId}`;
      }
      const response = await fetchWithRetry(url, 3, 1000);
      if (!response.ok) {
        console.error("获取完整时间线失败:", error);
        alert("获取完整时间线失败，请检查控制台错误信息");
        return allTimelines; 
      }
      const timelines = await response.json();
      if (!timelines || timelines.length === 0) {
        break;
      }
      for (const timeline of timelines) {
        allTimelines.push(timeline);
      }
      if (timelines.length < limit) {
        hasMore = false;
        break;
      }
      lastId = timelines[timelines.length - 1].id;
    }
  } catch (error) {
    console.error("获取完整时间线失败:", error);
    alert("获取完整时间线失败，请检查控制台错误信息");
    return allTimelines;
  }
  // console.log(`获取到 ${tsukomiTimelines.length} 条吐槽时间线`);
  return allTimelines;
}

// 带重试的fetch函数
async function fetchWithRetry(url, maxRetries, delay) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`请求失败，重试${maxRetries}次后仍失败: ${error.message}`);
      }
      console.warn(`第${attempt}次请求失败，${delay}ms后重试...`, error.message);
      await sleep(delay);
      delay *= 2;
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
