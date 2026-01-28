// 过滤时间线
export function filterTimelinesByCat(timelines, checkboxes) {
  const selectedCatSets = checkboxes
    .filter(cb => cb.checked)
    .map(cb => ({
      cat: cb.cat,
      set: new Set(Array.isArray(cb.cat) ? cb.cat : [cb.cat])
    })
  );
  if (selectedCatSets.length === 0) {
    return [];
  }
  return timelines.filter(timeline => {
    return selectedCatSets.some(({ set }) => set.has(timeline.cat));
  });
}