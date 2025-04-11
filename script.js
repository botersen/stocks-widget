const symbols = [
  { name: 'S&P 500', symbol: '^GSPC', id: 'spx' },
  { name: 'NASDAQ', symbol: '^IXIC', id: 'nasdaq' },
  { name: 'DOW', symbol: '^DJI', id: 'dow' }
];

async function fetchQuote(symbol) {
  const res = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=demo`);
  const data = await res.json();
  return data[0];
}

function updateCard(data, id) {
  const card = document.getElementById(`card-${id}`);
  const percent = data.changesPercentage.toFixed(2);
  const color = percent >= 0 ? 'lime' : 'red';

  card.innerHTML = `
    <div class="title">${data.name}</div>
    <div class="price" style="color:${color}; font-weight:600;">
      ${percent > 0 ? '+' : ''}${percent}%
    </div>
  `;
}

async function updateAll() {
  for (const { name, symbol, id } of symbols) {
    try {
      const data = await fetchQuote(symbol);
      updateCard(data, id);
    } catch (e) {
      console.error(`Error loading ${symbol}`, e);
    }
  }
}

setInterval(updateAll, 300000); // update every 5 minutes
updateAll();

