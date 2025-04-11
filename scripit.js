const API_KEY = '4f0e94fbae72478282b8789831a26606';
const chartData = [];
let chartInstance;

async function fetchData() {
  try {
    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=SPX&interval=1min&apikey=${API_KEY}&outputsize=30`);
    const data = await response.json();
    const points = data.values.reverse();

    const times = points.map(p => p.datetime.slice(11, 16));
    const prices = points.map(p => parseFloat(p.close));

    updatePrice(prices);
    renderChart(times, prices);
  } catch (e) {
    console.error('Failed to fetch stock data:', e);
  }
}

function updatePrice(prices) {
  const change = prices[prices.length - 1] - prices[0];
  const percent = ((change / prices[0]) * 100).toFixed(2);
  const el = document.getElementById('price-spx');
  el.innerText = `${change >= 0 ? '+' : ''}${percent}%`;
  el.style.color = change >= 0 ? 'lime' : 'red';
}

function renderChart(labels, data) {
  const ctx = document.getElementById('chart-spx').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: data[data.length - 1] >= data[0] ? 'lime' : 'red',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

fetchData();
setInterval(fetchData, 60000); // Refresh every 1 minute
