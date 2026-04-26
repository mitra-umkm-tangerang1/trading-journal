let trades = JSON.parse(localStorage.getItem("trades")) || [];
let filter = "all";
let chart;

function addTrade() {
  const pair = pairInput.value;
  const lot = parseFloat(lotInput.value);
  const entry = parseFloat(entryInput.value);
  const exit = parseFloat(exitInput.value);

  if (!pair || !lot || !entry || !exit) return alert("Isi semua");

  const pips = (exit - entry) * 100;
  const profit = pips * lot;
  const date = new Date();

  trades.unshift({ pair, lot, pips, profit, date });
  localStorage.setItem("trades", JSON.stringify(trades));

  render();
}

function deleteTrade(i) {
  trades.splice(i,1);
  localStorage.setItem("trades", JSON.stringify(trades));
  render();
}

function setFilter(f) {
  filter = f;
  render();
}

function getFiltered() {
  const now = new Date();
  return trades.filter(t => {
    const d = new Date(t.date);
    if (filter === "day")
      return d.toDateString() === now.toDateString();
    if (filter === "month")
      return d.getMonth() === now.getMonth();
    return true;
  });
}

function render() {
  const history = document.getElementById("history");
  const totalEl = document.getElementById("total");

  let data = getFiltered();
  history.innerHTML = "";
  let total = 0;

  data.forEach((t,i) => {
    total += t.profit;

    history.innerHTML += `
      <div class="trade" ontouchstart="this.style.transform='translateX(-60px)'">
        <button class="delete-btn" onclick="deleteTrade(${i})">Hapus</button>
        <div>${t.pair} | ${t.pips.toFixed(1)} pips</div>
        <div style="color:${t.profit>=0?'green':'red'}">
          ${t.profit.toFixed(2)}
        </div>
      </div>
    `;
  });

  totalEl.innerText = total.toFixed(2);
  renderChart(data);
}

function renderChart(data) {
  const ctx = document.getElementById("chart");

  const profits = data.map(t => t.profit);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: profits.map((_,i)=>i+1),
      datasets: [{
        label: "Profit",
        data: profits,
        borderColor: "black"
      }]
    }
  });
}

render();
