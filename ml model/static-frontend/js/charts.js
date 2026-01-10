export function renderLineChart(ctx, datasets, labels, options = {}) {
  const chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: false } },
      ...options
    }
  });
  return chart;
}

export function updateChart(chart, { datasets, labels }) {
  if (labels) chart.data.labels = labels;
  if (datasets) chart.data.datasets = datasets;
  chart.update();
}
