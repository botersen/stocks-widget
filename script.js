const apiKey = 'uWGmeTTuc51qtDXOnmujrQDpVbGvhAyu';
const interval = 1 * 60 * 1000; // 1 minute updates

const stocks = [
  { symbol: '^GSPC', chartId: 'spChart', data: [] },      // S&P 500
  { symbol: '^NDX', chartId: 'nasdaqChart', data: [] },   // Nasdaq 100
  { symbol: '^DJI', chartId: 'dowChart', data: [] },      // Dow Jones
];

const charts = {};

function createChart(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Price',
        data: [],
        fill: false,
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 0,
        borderColor: '#00ff99',
      }]
    },
    options: {
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

async function fetchPrice(symbol) {
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`);
    const json = await res.json();
    return json[0]?.price;
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err);
    return null;
  }
}

async function updateData() {
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  for (const stock of stocks) {
    const price = await fetchPrice(stock.symbol);
    if (price) {
      stock.data.push({ x: time, y: price });
      const chart = charts[stock.chartId];
      chart.data.labels.push(time);
      chart.data.datasets[0].data.push(price);
      chart.update();
    }
  }
}

function init() {
  for (const stock of stocks) {
    const ctx = document.getElementById(stock.chartId).getContext('2d');
    charts[stock.chartId] = createChart(ctx);
  }
  updateData();
  setInterval(updateData, interval);
}

window.onload = init;
