const API_KEY = "uWGmeTTuc51qtDXOnmujrQDpVbGvhAyu";
const symbols = ["^GSPC", "^IXIC", "^DJI"]; // S&P 500, NASDAQ, DOW
const interval = 5 * 60 * 1000; // 5 minutes

function getSymbolName(symbol) {
  switch (symbol) {
    case "^GSPC": return "S&P 500";
    case "^IXIC": return "NASDAQ";
    case "^DJI": return "DOW";
    default: return symbol;
  }
}

async function fetchChartData(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/historical-chart/5min/${symbol}?apikey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.reverse().slice(0, 30); // Keep last 30 points
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return [];
  }
}

function updateChart(canvasId, chartInstance, prices) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const isUp = prices[prices.length - 1].close > prices[0].close;
  const color = isUp ? "lime" : "red";

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: prices.map(p => p.date.slice(11, 16)), // HH:MM
      datasets: [{
        data: prices.map(p => p.close),
        borderColor: color,
        fill: false,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
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

async function renderAllCharts() {
  for (const symbol of symbols) {
    const prices = await fetchChartData(symbol);
    const container = document.getElementById(`card-${symbol}`);
    const priceEl = document.getElementById(`price-${symbol}`);
    const canvasId = `chart-${symbol}`;

    if (prices.length) {
      const change = (prices[prices.length - 1].close - prices[0].close).toFixed(2);
      const percent = (((prices[prices.length - 1].close - prices[0].close) / prices[0].close) * 100).toFixed(2);
      const isUp = change > 0;

      priceEl.textContent = `${change > 0 ? "+" : ""}${percent}%`;
      priceEl.style.color = isUp ? "lime" : "red";

      updateChart(canvasId, null, prices);
    } else {
      priceEl.textContent = "Error loading";
    }
  }
}

// Initial render
renderAllCharts();
// Auto-update every 5 minutes
setInterval(renderAllCharts, interval);
