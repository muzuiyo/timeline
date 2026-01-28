import { timelineTypes } from "./type.js";
import { exportTimelines } from "./core.js";
import { formats } from "./type.js";

export function showTsukkomiMenu(username) {
  event.preventDefault();
  let checkboxes = [];
  // 如果已有菜单，先移除
  const existingMenu = document.getElementById("tsukkomi-export-menu");
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  // 创建样式元素
  const style = document.createElement("style");
  style.textContent = `
    #tsukkomi-export-menu {
      background-color: #ffffff;
      color: #333333;
      border: 1px solid #e0e0e0;
    }
    
    #tsukkomi-export-loading-box {
      background-color: #ffffff;
      color: #333333;
      border: 1px solid #e0e0e0;
    }
    
    #tsukkomi-export-result-box {
      background-color: #ffffff;
      color: #333333;
      border: 1px solid #e0e0e0;
    }
    
    [data-theme="dark"] #tsukkomi-export-menu {
      background-color: #1e1e1e;
      color: #e0e0e0;
      border: 1px solid #444444;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    [data-theme="dark"] #tsukkomi-export-loading-box {
      background-color: #1e1e1e;
      color: #e0e0e0;
      border: 1px solid #444444;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    [data-theme="dark"] #tsukkomi-export-result-box {
      background-color: #1e1e1e;
      color: #e0e0e0;
      border: 1px solid #444444;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .type-checkbox-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 15px 0;
    }
    
    .type-checkbox-item {
      display: flex;
      align-items: center;
      padding: 8px 10px;
      border-radius: 6px;
      background: #f5f5f5;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    [data-theme="dark"] .type-checkbox-item {
      background: #2a2a2a;
    }
    
    .type-checkbox-item:hover {
      background: #e8e8e8;
    }
    
    [data-theme="dark"] .type-checkbox-item:hover {
      background: #333333;
    }
    
    .type-checkbox-item input[type="checkbox"] {
      margin-right: 12px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    
    .type-checkbox-content {
      flex: 1;
    }
    
    .type-checkbox-name {
      font-weight: 600;
      font-size: 12px;
    }
    
    .type-checkbox-desc {
      font-size: 12px;
      opacity: 0.7;
      margin-top: 2px;
    }
    
    .type-checkbox-actions {
      display: flex;
      gap: 8px;
      margin-top: 5px;
    }
  `;
  document.head.appendChild(style);

  // 创建遮罩层
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
  `;
  overlay.id = "tsukkomi-export-menu-overlay";

  // 创建菜单容器
  const menu = document.createElement("div");
  menu.id = "tsukkomi-export-menu";
  menu.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    min-width: 300px;
    max-width: 500px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // 创建标题
  const title = document.createElement("h3");
  title.innerText = "导出时间胶囊";
  title.style.cssText = `
    margin: 10px 0 10px 0;
    font-size: 18px;
    text-align: center;
    padding-bottom: 10px;
  `;

  // 创建主要内容容器
  const mainContainer = document.createElement("div");
  mainContainer.id = "tsukkomi-export-main";

  // 创建格式选择区域
  const formatContainer = document.createElement("div");
  formatContainer.style.cssText = `
    margin-bottom: 20px;
  `;

  const formatLabel = document.createElement("p");
  formatLabel.textContent = "选择导出格式：";
  formatLabel.style.cssText = `
    margin: 0 0 10px 0;
    font-size: 14px;
  `;

  // 创建导出按钮容器
  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 15px;
  `;

  // 创建导出格式按钮
  // 格式选择按钮
  const formatButtons = formats.map((format) => {
    const button = document.createElement("button");
    button.innerHTML = `${format.icon} ${format.name}`;
    button.style.cssText = `
      padding: 12px 10px;
      background: ${format.color};
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    `;
    const desc = document.createElement("span");
    desc.textContent = format.desc;
    desc.style.cssText = `
      font-size: 11px;
      opacity: 0.9;
      font-weight: normal;
      text-align: center;
    `;
    button.appendChild(desc);
    button.onmouseenter = () => {
      button.style.transform = "translateY(-1px)";
      button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    };
    button.onmouseleave = () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "none";
    };
    button.onclick = () => {
      const selectedBoxes = [];
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selectedBoxes.push(checkbox);
        }
      });
      exportTimelines(format.name.toLowerCase(), selectedBoxes, username);
    };
    return button;
  });
  formatButtons.forEach((btn) => buttonContainer.appendChild(btn));

  // 创建类型选择区域
  const typeContainer = document.createElement("div");
  typeContainer.style.cssText = `
    margin: 15px 0;
  `;

  // 创建类型选择容器
  const typeCheckboxContainer = document.createElement("div");
  typeCheckboxContainer.className = "type-checkbox-container";
  const typeLabel = document.createElement("p");
  typeLabel.textContent = "选择导出类型：";
  typeLabel.style.cssText = `
    margin: 0 0 10px 0;
    font-size: 14px;
  `;

  // 创建类型复选框
  Object.entries(timelineTypes).forEach(([key, value]) => {
    const item = document.createElement("label");
    item.className = "type-checkbox-item";
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "timeline-type";
    checkbox.value = key;
    checkbox.cat = value.cat;
    checkbox.checked = true;
    checkboxes.push(checkbox);
    
    const content = document.createElement("div");
    content.className = "type-checkbox-content";
    
    const nameSpan = document.createElement("span");
    nameSpan.className = "type-checkbox-name";
    nameSpan.innerHTML = `${value.name}`;
    nameSpan.style.marginRight = "2px";

    const descSpan = document.createElement("span");
    descSpan.className = "type-checkbox-desc";
    descSpan.textContent = value.desc;
    
    content.appendChild(nameSpan);
    content.appendChild(descSpan);
    
    item.appendChild(checkbox);
    item.appendChild(content);
    typeCheckboxContainer.appendChild(item);
  });

  // 创建操作按钮区域
  const actionContainer = document.createElement("div");
  actionContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    gap: 10px;
  `;

  // 关闭按钮
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "关闭";
  closeBtn.style.cssText = `
    padding: 10px 15px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    flex: 1;
  `;
  closeBtn.onclick = () => {
    menu.remove();
    overlay.remove();
  };

  // 组装菜单内容
  actionContainer.appendChild(closeBtn);
  formatContainer.appendChild(formatLabel);
  formatContainer.appendChild(buttonContainer);
  typeContainer.appendChild(typeLabel);
  typeContainer.appendChild(typeCheckboxContainer);
  menu.appendChild(title);
  mainContainer.appendChild(formatContainer);
  mainContainer.appendChild(typeContainer);
  menu.appendChild(mainContainer);
  menu.appendChild(actionContainer);

  // 添加到页面
  document.body.appendChild(overlay);
  document.body.appendChild(menu);

  // 点击遮罩层关闭
  overlay.onclick = () => {
    menu.remove();
    overlay.remove();
  };
}

// 显示加载提示
export function showLoading(message = "正在导出，请稍候...") {
  // 移除现有加载提示
  hideLoading();
  
  // 创建遮罩层
  const overlay = document.createElement("div");
  overlay.id = "tsukkomi-export-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  // 创建加载框
  const loadingBox = document.createElement("div");
  loadingBox.id = "tsukkomi-export-loading-box";
  loadingBox.style.cssText = `
    padding: 30px 50px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
    min-width: 200px;
  `;

  const loadingText = document.createElement("div");
  loadingText.style.cssText = `
    font-size: 16px;
    margin-bottom: 20px;
  `;
  loadingText.innerText = message;

  const spinner = document.createElement("div");
  spinner.style.cssText = `
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  `;

  // 添加旋转动画
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  loadingBox.appendChild(loadingText);
  loadingBox.appendChild(spinner);
  overlay.appendChild(loadingBox);
  document.body.appendChild(overlay);
}

// 显示完成提示
export function showResult(type = "success") {
  // 移除可能已存在的提示
  const existingOverlay = document.getElementById("tsukkomi-export-result-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // 创建遮罩层
  const overlay = document.createElement("div");
  overlay.id = "tsukkomi-export-result-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  // 创建结果框
  const resultBox = document.createElement("div");
  resultBox.id = "tsukkomi-export-result-box";
  resultBox.style.cssText = `
    padding: 20px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
  `;

  const resultText = document.createElement("div");
  resultText.style.cssText = `
    height: 40px;
    width: 100%;
    font-size: 16px;
    margin-bottom: 0px;
  `;
  resultText.innerText = type === 'success' ? '✅ 导出成功，文件已下载' : '❌ 导出失败，请查看控制台消息';

  // 创建关闭按钮
  const closeButton = document.createElement("button");
  closeButton.innerText = "关闭";
  closeButton.style.cssText = `
    width: 100%;
    padding: 10px 10px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    flex: 1;
  `;

  // 点击按钮关闭
  closeButton.addEventListener("click", () => {
    overlay.remove();
  });

  // 组装元素
  resultBox.appendChild(resultText);
  resultBox.appendChild(closeButton);
  overlay.appendChild(resultBox);
  document.body.appendChild(overlay);
}

// 隐藏加载提示
export function hideLoading() {
  const overlay = document.getElementById("tsukkomi-export-overlay");
  if (overlay) {
    overlay.remove();
  }
}