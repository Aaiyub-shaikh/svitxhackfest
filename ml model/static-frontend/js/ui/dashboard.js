import { IoTAPI } from '../api.js';
import { getCurrentUser } from '../auth.js';
import { t } from '../i18n.js';
import { renderLineChart, updateChart } from '../charts.js';
import { demoPlots, sampleDashboard } from '../data/demoData.js';

export async function renderFarmerDashboard(container) {
  container.innerHTML = `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold" data-i18n="dashboard.title">${t('dashboard.title')}</h1>
        <div class="flex items-center gap-2">
          ${plotSelectHtml()}
          ${rangeButtonsHtml()}
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="statCards">
        ${statCard('stats.moisture', '--')}
        ${statCard('stats.temperature', '--')}
        ${statCard('stats.rain', '--%')}
        ${statCard('stats.alerts', '--')}
      </div>
      <div class="bg-white rounded-2xl shadow-md p-4 h-64">
        <canvas id="iotChart" aria-label="IoT Trend Chart" role="img"></canvas>
      </div>
      <div id="reports" class="space-y-2">
        <div class="font-medium">Latest disease reports</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="reportList"></div>
        <a href="#/farmer/disease-scan" class="inline-block px-4 py-2 rounded-2xl bg-green-600 text-white">Upload New</a>
      </div>
    </section>`;

  const user = getCurrentUser();
  const plotSel = container.querySelector('#plotSel');
  const rangeBtns = container.querySelectorAll('[data-range]');
  const ctx = container.querySelector('#iotChart');
  let chart = null;

  async function load(range='7d') {
    const plotId = plotSel.value;
    setStatsSkeleton(true);
    try {
      const data = await IoTAPI.getDashboard({ farmerId: user.id, plotId });
      applyDashboard(data);
    } catch {
      const data = sampleDashboard({ plotId });
      applyDashboard(data);
    } finally { setStatsSkeleton(false); }
  }

  function applyDashboard(data) {
    const stats = data.latest || {};
    setStat('moisture', `${stats.moisture ?? '--'}%`);
    setStat('temperature', `${stats.temperature ?? '--'}°C`);
    setStat('rain', `${stats.forecastRain ?? '--'}%`);
    setStat('alerts', `${stats.alerts ?? '--'}`);

    const labels = data.chart?.labels || [];
    const datasets = [
      { label: t('stats.moisture'), data: data.chart?.moisture || [], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,.2)', tension: 0.3 },
      { label: t('stats.temperature'), data: data.chart?.temperature || [], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.2)', tension: 0.3 }
    ];
    if (!chart) chart = renderLineChart(ctx, datasets, labels);
    else updateChart(chart, { datasets, labels });

    const rl = document.getElementById('reportList');
    rl.innerHTML = '';
    (data.diseaseReports||[]).forEach(r => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl shadow p-3 flex items-center gap-3';
      card.innerHTML = `<img alt="" src="${r.image}" class="w-12 h-12 rounded object-cover"><div><div class="font-medium">${r.label}</div><div class="text-xs text-gray-600">Confidence: ${(r.confidence*100).toFixed(0)}%</div></div>`;
      rl.appendChild(card);
    });
  }

  function setStatsSkeleton(on) {
    document.querySelectorAll('#statCards .card').forEach(c => on ? c.classList.add('skeleton') : c.classList.remove('skeleton'));
  }

  function setStat(key, val) {
    const id = key.replace('stats.', 'stat-');
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  plotSel.addEventListener('change', () => load());
  rangeBtns.forEach(b => b.addEventListener('click', () => { rangeBtns.forEach(x=>x.classList.remove('bg-green-600','text-white')); b.classList.add('bg-green-600','text-white'); load(b.dataset.range); }));

  load();
}

function statCard(i18nKey, value) {
  const id = i18nKey.replace('stats.', 'stat-');
  return `<div class="card bg-white rounded-2xl shadow-md p-4"><div class="text-xs text-gray-600" data-i18n="${i18nKey}">${i18nKey}</div><div id="${id}" class="text-xl font-semibold mt-1">${value}</div></div>`;
}

function plotSelectHtml() {
  const options = (demoPlots||[]).map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  return `<label class="text-sm mr-2" for="plotSel" data-i18n="plots.select">Select Plot</label><select id="plotSel" class="px-2 py-1 border rounded">${options}</select>`;
}

function rangeButtonsHtml() {
  return `<div class="flex items-center gap-1">
    <button class="px-2 py-1 rounded border" data-range="today" data-i18n="range.today">Today</button>
    <button class="px-2 py-1 rounded border bg-green-600 text-white" data-range="7d" data-i18n="range.7d">7 Days</button>
    <button class="px-2 py-1 rounded border" data-range="30d" data-i18n="range.30d">30 Days</button>
  </div>`;
}
