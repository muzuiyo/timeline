// 处理时间
export function formatTimestamp(timestamp, format = 'YYYY/MM/DD HH:mm') {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// 删除换行符，用空格代替(TXT)
export function replaceLineBreaksWithSpace(text) {
  return text.replace(/\r?\n|\r/g, ' ');
}

// 处理单元格文本(EXCEL)
export function cleanTextForExcel(text) {
  if (!text) return '';
  return text
    // 换行符
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // 制表符
    .replace(/\t/g, ' ')
    // 不同场景
    .split('\n')
    .map((line, index, array) => {
      const trimmed = line.trim();
      if (trimmed === '' && index > 0 && index < array.length - 1) {
        return ';';
      }
      const bulletMatch = trimmed.match(/^([•\-*\d+\.\)])\s+(.*)/);
      if (bulletMatch) {
        return `${bulletMatch[1]} ${bulletMatch[2]}`;
      }
      return trimmed;
    })
    .filter(line => line !== '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/;\s+/g, '; ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .replace(/\s+;/g, ';')
    .trim();
}