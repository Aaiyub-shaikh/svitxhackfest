export const demoPlots = [
  { id: 'plot-1', name: 'Plot A' },
  { id: 'plot-2', name: 'Plot B' }
];

export function sampleDashboard({ plotId = 'plot-1' } = {}) {
  const labels = Array.from({ length: 7 }, (_, i) => `Day ${i+1}`);
  const moisture = [42, 45, 40, 43, 44, 41, 46];
  const temperature = [28, 29, 27, 30, 31, 29, 28];
  return {
    latest: { moisture: moisture.at(-1), temperature: temperature.at(-1), forecastRain: 30, alerts: 1 },
    diseaseReports: [
      { id: 'dr-1', label: 'Leaf Rust', confidence: 0.82, image: 'https://via.placeholder.com/64' },
      { id: 'dr-2', label: 'Blight', confidence: 0.64, image: 'https://via.placeholder.com/64' }
    ],
    chart: { labels, moisture, temperature }
  };
}

export function sampleMarketplace() {
  return [
    { id: 'm1', cropType: 'Wheat', quantity: 1000, priceRange: '₹18-22/kg', region: 'Pune', contactDetails: 'buyer1@example.com, +91-9000000001', validUntil: '2025-12-31' },
    { id: 'm2', cropType: 'Tomato', quantity: 500, priceRange: '₹10-15/kg', region: 'Nashik', contactDetails: 'buyer2@example.com, +91-9000000002', validUntil: '2025-11-30' }
  ];
}
