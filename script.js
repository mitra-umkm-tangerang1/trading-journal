let trades = JSON.parse(localStorage.getItem("trades")) || [];
let chart;

function addTrade() {
  const type = document.getElementById("type").value;
  const pair = document.getElementById("pair").value;
  const lot = parseFloat(document.getElementById("lot").value);
  const entry = parseFloat(document.getElementById("entry").value);
  const tp = parseFloat(document.getElementById("tp").value);
  const sl = parseFloat(document.getElementById("sl").value);

  if (!pair || isNaN(lot) || isNaN(entry) || isNaN(tp) || isNaN(sl)) {
    alert("Isi semua data!");
    return;
  }

  // hitung pips berdasarkan BUY / SELL
  let pips = 0;
  if (type === "BUY") {
    pips = (tp - entry) * 100;
  } else {
    pips = (entry - tp) * 100;
  }

  const profit = pips * lot;

  const now = new Date();
  const date = now.toLocaleDateString("id-ID");

  trades.unshift({ date, type, pair, lot, pips, profit });

  localStorage.setItem("trades", JSON.stringify(trades));
  render();
}

function deleteTrade(i) {
  trades.splice(i, 1);
  localStorage.setItem("trades", JSON.stringify(trades));
  render();
}

function render() {
  const history = document.getElementById("history");
  const totalEl = document.getElementById("total");

  history.innerHTML = "";
  let total = 0;

  trades.forEach((t, i) => {
    total += t.profit;

    history.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.type}</td>
        <td>${t.pair}</td>
        <td>${t.lot}</td>
        <td>${t.pips.toFixed(1)}</td>
        <td style="color:${t.profit >= 0 ? 'green' : 'red'}">
          ${t.profit.toFixed(2)}
        </td>
        <td>
          <button class="delete-btn" onclick="deleteTrade(${i})">X</button>
        </td>
      </tr>
    `;
  });

  totalEl.innerText = total.toFixed(2);
  renderChart();
}

function renderChart() {
  const ctx = document.getElementById("chart");
  if (!ctx) return;

  const profits = trades.map(t => t.profit);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: profits.map((_, i) => i + 1),
      datasets: [{
        label: "Profit",
        data: profits,
        borderWidth: 2
      }]
    }
  });
}

render();
