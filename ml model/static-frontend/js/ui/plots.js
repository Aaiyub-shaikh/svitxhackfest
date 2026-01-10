export function createPlotSelector({ plots = [], selectedId, onChange }) {
  const wrap = document.createElement('div');
  const sel = document.createElement('select');
  sel.className = 'px-2 py-1 border rounded';
  plots.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name; sel.appendChild(opt);
  });
  if (selectedId) sel.value = selectedId;
  sel.addEventListener('change', () => onChange?.(sel.value));
  wrap.appendChild(sel);
  return wrap;
}

export function readingCard({ label, value, unit }) {
  const div = document.createElement('div');
  div.className = 'bg-white rounded-2xl shadow p-4';
  div.innerHTML = `<div class="text-xs text-gray-600">${label}</div><div class="text-xl font-semibold">${value}${unit || ''}</div>`;
  return div;
}
