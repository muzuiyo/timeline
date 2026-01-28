// 核心功能函数
// 导出时间线数据
import { getAllTsukomiTimelines } from './api.js';
import { filterTimelinesByCat } from './utils/filter.js';
import { showLoading, hideLoading, showResult } from './ui.js';
import { downloadJSONFile, converToExcel, converToTxt, converToPDF } from './utils/converToFile.js';

export async function exportTimelines(format, checkboxes, username) {
  // console.log(`导出格式: ${format}`);
  // console.log(`选择的类型: ${checkboxes.filter(cb => cb.checked).map(cb => cb.value).join(", ")}`);
  if(checkboxes.filter(cb => cb.checked).length === 0) {
    alert("请至少选择一种类型进行导出");
    return;
  }
  let isSuccessful = false;
  showLoading();
  // DEBUG 注释
  const originData = await getAllTsukomiTimelines(username);
  const filteredData = filterTimelinesByCat(originData, checkboxes);
  // console.log(`过滤后数据条数: ${filteredData.length}`);
  const jsonData = JSON.stringify(filteredData, null, 2);
  const now = Date.now();
  switch(format) {
    case "json":
      if(!downloadJSONFile(jsonData, `timelines_${username}_${now}.json`)) {
        alert("下载文件失败，请检查控制台错误信息");
        break;
      }
      isSuccessful = true;
      break;
    case "txt":
      if(!converToTxt(filteredData, `timelines_${username}_${now}.txt`)) {
        alert("下载文件失败，请检查控制台错误信息");
        break;
      }
      isSuccessful = true;
      break;
    case "excel":
      if(!converToExcel(filteredData, `timelines_${username}_${now}.csv`)) {
        alert("下载文件失败，请检查控制台错误信息");
        break;
      }
      isSuccessful = true;
      break;
    case "pdf":
    case "html":
      if(!await converToPDF(filteredData, `timelines_${username}_${now}.pdf`, username)) {
        alert("下载文件失败，请检查控制台错误信息");
        break;
      }
      isSuccessful = true;
      break;
    default:
      console.error("未知的导出格式:", format);
      return;
  }
  hideLoading();
  if(isSuccessful) {
    showResult('success');
  }
  else {
    showResult('error');
  }
}
