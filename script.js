let trades = JSON.parse(localStorage.getItem("trades")) || [];

function addTrade() {
  const pair = document.getElementById("pair").value;
  const lot = parseFloat(document.getElementById("lot").value);
  const entry = parseFloat(document.getElementById("entry").value);
  const exit = parseFloat(document.getElementById("exit").value);

  if (!pair || !lot || !entry || !exit) {
    alert("Isi semua data!");
    return;
  }

  const pips = (exit - entry) * 100;
  const profit = pips * lot;

  const date = new Date().toLocaleString();

  const trade = { date, pair, lot, pips, profit };

  trades.push(trade);
  localStorage.setItem("trades", JSON.stringify(trades));

  render();
}

function render() {
  const history = document.getElementById("history");
  const totalEl = document.getElementById("total");

  history.innerHTML = "";
  let total = 0;

  trades.forEach(t => {
    total += t.profit;

    history.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.pair}</td>
        <td>${t.lot}</td>
        <td>${t.pips.toFixed(1)}</td>
        <td style="color:${t.profit >= 0 ? 'lime' : 'red'}">
          ${t.profit.toFixed(2)}
        </td>
      </tr>
    `;
  });

  totalEl.innerText = total.toFixed(2);
}

render();
