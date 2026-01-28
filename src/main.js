// 主程序入口
// 载入脚本
console.log("📬 Export Timelines");

// 初始化配置
const nameElement = document.querySelector(
  "#headerProfile .subjectNav .headerContainer .inner .name a",
);
if (!nameElement) {
  stopScript();
}

import { showTsukkomiMenu } from './ui.js';

const username = nameElement.href.split("/").pop();
const displayName = nameElement.innerText;

if (username) {
  // 在页面上添加组件
  let exportLink = document.createElement("div");
  exportLink.id = "tsukkomi-export-link";
  exportLink.className = "menu_inner";
  exportLink.align = "absmiddle";
  exportLink.innerHTML = `
    <span class="tip">
      📬 <a href="#" class="l">导出${displayName}的时间胶囊</a>
    </span>
  `
  $("div#columnTimelineB").append(exportLink);
  const aElement = exportLink.querySelector("a.l");
  aElement.addEventListener("click", function (event) {
    event.preventDefault();
    showTsukkomiMenu(username);
  });
}

function stopScript() {
  return;
}


