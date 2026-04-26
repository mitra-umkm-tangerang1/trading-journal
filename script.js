let trades = JSON.parse(localStorage.getItem("trades")) || [];
let chart;

function addTrade() {
  const type = document.getElementById("type").value;
  const pair = document.getElementById("pair").value.toUpperCase();
  const lot = parseFloat(document.getElementById("lot").value);
  const entry = parseFloat(document.getElementById("entry").value);
  const tp = parseFloat(document.getElementById("tp").value);
  const sl = parseFloat(document.getElementById("sl").value);

  if (!pair || isNaN(lot) || isNaN(entry) || isNaN(tp)) {
    alert("Isi data dengan benar!");
    return;
  }

  let profit = 0;
  let pips = 0;

  // =========================
  // KHUSUS XAUUSD (AKURAT)
  // =========================
  if (pair === "XAUUSD") {
    if (type === "BUY") {
      profit = (tp - entry) * lot * 100;
      pips = (tp - entry) * 100;
    } else {
      profit = (entry - tp) * lot * 100;
      pips = (entry - tp) * 100;
    }
  }

  // =========================
  // FOREX USD (EURUSD dll)
  // =========================
  else if (pair.includes("USD")) {
    if (type === "BUY") {
      pips = (tp - entry) * 10000;
    } else {
      pips = (entry - tp) * 10000;
    }

    profit = pips * lot * 10;
  }

  // =========================
  // BLOK PAIR LAIN
  // =========================
  else {
    alert("Pair tidak didukung! Gunakan XAUUSD atau pair USD saja.");
    return;
  }

  const date = new Date().toLocaleString("id-ID");

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
