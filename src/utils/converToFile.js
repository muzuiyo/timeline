import { parseTimelineByCatAndType } from "./parser/timelines.js";
import { generateTimelineItemToHtml } from "./pdf/item.js";

const areObjectsEqualAsString = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export function converToTxt(timelines, filename) {
  let txt = "";
  timelines.forEach((timeline) => {
    const txtTimeline = parseTimelineByCatAndType(timeline, "txt");
    if (!areObjectsEqualAsString(txtTimeline, timeline)) {
      txt = txt + txtTimeline + "\n";
    }
  });
  return downloadTXTFile(txt, filename);
}

export function converToExcel(timelines, filename) {
  let excelHeader = "时间,活动类型,内容,评论\n";
  let excelContent = "";
  timelines.forEach((timeline) => {
    const excelTimeline = parseTimelineByCatAndType(timeline, "excel");
    if (!areObjectsEqualAsString(excelTimeline, timeline)) {
      excelContent = excelContent + excelTimeline + "\n";
    }
  });
  let excel = excelHeader + excelContent;
  return downloadExcelFile(excel, filename);
}

export async function converToPDF(timelines, filename, username = "") {
  let pdfContent = "";
  timelines.forEach((timeline) => {
    const pdftimeline = parseTimelineByCatAndType(timeline, "pdf", username);
    if (!areObjectsEqualAsString(pdftimeline, timeline)) {
      pdfContent = pdfContent + generateTimelineItemToHtml(pdftimeline) + "\n";
    }
  });
  return downloadPdfFile(pdfContent, filename);
}

// 下载 JSON 文件
export function downloadJSONFile(data, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([data], { type: "application/json" }),
  );
  link.download = filename;
  try {
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 1000);
  } catch (error) {
    console.error("下载 JSON 文件失败:", error);
    return false;
  }
  return true;
}

// 下载 TXT 文件
export function downloadTXTFile(data, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([data], { type: "text/plain;charset=utf-8" }),
  );
  link.download = filename;
  try {
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 1000);
  } catch (error) {
    console.error("下载 TXT 文件失败:", error);
    return false;
  }
  return true;
}

// 下载 EXCLE 文件，只支持传入 string
export function downloadExcelFile(data, filename) {
  let csvContent = data;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" }),
  );
  link.download = filename;
  try {
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 1000);
  } catch (error) {
    console.error("下载 EXCEL 文件失败:", error);
    return false;
  }
  return true;
}

// 只支持传入html
export async function downloadPdfFile(data, filename) {
  const container = document.createElement("div");
  // 添加样式
  if (document.getElementById("export-timeline-pdf-container")) {
    document.body.removeChild(
      document.getElementById("export-timeline-pdf-container"),
    );
  }
  container.id = "export-timeline-pdf-container";
  const style = document.createElement("style");
  const styleText = `
    .pdftimeline-item {
        width: 100%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        font-family: 'SF Pro SC', 'SF Pro Display', 'PingFang SC', 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif, "Hiragino Sans GB";
        line-height: 150%;
        /* 打印处理 */
        break-inside: avoid;
        page-break-inside: avoid;
    }

    .pdftimeline-item-meta-date {
        width: 100%;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        margin-bottom: 5px;
        border-bottom: 1px solid #e8e8e8;
    }

    .pdftimeline-item-main {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
    }

    .pdftimeline-item-main-columnA {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: calc(100%-70x);
        padding-right: 10px;
    }

    .pdftimeline-item-main-status {
        width: 100%;
        font-size: 14px;
        margin: 5px 0;
        text-align: justify;
    }

    .pdftimeline-item-main-comment {
        width: 100%;
        font-size: 15px;
        margin: 5px 0;
        border: 1px solid #e8e8e8;
        border-radius: 8px;
        margin: 5px 0;
        padding: 5px 10px;
        text-align: justify;
        box-sizing: border-box;
    }

    .pdftimeline-item-main-subject {
        width: 100%;
        margin: 5px 0;
        border: 1px solid #e8e8e8;
        border-radius: 8px;
        padding: 5px 10px 5px 4px;
        box-sizing: border-box;
        display: flex;
    }

    .pdftimeline-item-subject-cover-container {
        display: flex;
        flex-direction: column; 
        width: 65px;
        height: auto;
        margin-right: 5px;
    }

    .pdftimeline-item-subject-cover {
        width: 65px;
        height: auto;
        margin-top: 0;
        border-radius: 4px;
    }

    .pdftimeline-item-main-subject-info {
        padding-bottom: 0px;
    }

    .pdftimeline-item-main-subject-info-name {
        display: block;
        margin: 0;
        font-size: 13px;
        text-align: justify;
        font-weight: 500;
        line-height: 150%;
        color: #555;
    }

    .pdftimeline-item-main-subject-info-more {
        display: block;
        margin: 0;
        font-size: 12px;
        text-align: justify;
        line-height: 25px;
        color: #999;
    }

    .pdftimeline-item-main-columnB {
        width: 65px;
        height: auto;
    }

    .pdftimeline-item-main-columnB .social-avatar {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        display: block;
        margin: 0 auto;
        padding-top: 10px;
    }

    .pdftimeline-item-meta-more {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 5px 10px 5px 0;
    }

    .pdftimeline-item-meta-more div{
        display: flex;
        margin-right: 10px;
        font-size: 12px;
        text-align: justify;
        line-height: 25px;
        height: 25px;
        overflow: hidden;
        color: #999;
    }
    
    * {
      /* 确保文本可选中 */
      * {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
      }
      
      /* 避免使用可能转换为图像的CSS属性 */
      body, div, p, span {
          -webkit-filter: none !important;
          filter: none !important;
          mix-blend-mode: normal !important;
      }
    }`;
  style.textContent = styleText;

  container.innerHTML = data.toString();
  container.appendChild(style);

  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        ${container.innerHTML}
    </body>
    </html>
  `;

  // 打印 Container
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([htmlContent], { type: "text/html" }),
  );
  link.download = filename.replace("pdf", "html");
  try {
    // 于是我放弃了PDF:D
    // generatePdf(htmlContent);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 1000);
  } catch (error) {
    const c = document.getElementById("export-timeline-pdf-container");
    document.body.removeChild(c);
    console.error("下载文件失败:", error);
    return false;
  }
  return true;
}

// TODO 解决 PDF 文本不能复制问题
async function generatePdf(html) {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  await new Promise(resolve => {
    printWindow.onload = resolve;
  });
  const printStyles = ``;
  printWindow.document.head.innerHTML += printStyles;
  await new Promise(resolve => setTimeout(resolve, 1000));
  printWindow.print();
}