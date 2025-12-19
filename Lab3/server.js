const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));

let items = [
  { id: 1, name: "Персональный компьютер", cathegory: "Техника", price: 65000, quantity: 10 },
  { id: 2, name: "Компьютерноя мышь", cathegory: "Перефирия", price: 1500, quantity: 30 }
];

app.get("/", (req, res) => {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.cathegory}</td>
          <td>${item.price}</td>
          <td>${item.quantity}</td>
          <td>
            <form method="POST" action="/delete/${item.id}" style="display:inline">
              <button type="submit">❌ Удалить</button>
            </form>
          </td>
        </tr>
      `
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Таблица товаров</title>
      <style>
        table { border-collapse: collapse; width: 500px; }
        td, th { border: 1px solid #ccc; padding: 8px; }
        button { cursor: pointer; }
        form { margin: 0; }
      </style>
    </head>
    <body>
      <h2>Учет товаров</h2>

      <table>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Категория</th>
          <th>Цена</th>
          <th>Количество</th>
          <th>Действия</th>
        </tr>
        ${rows}
      </table>

      <form method="POST" action="/add">
        <h3>Добавить товар</h3>
        <input name="name" placeholder="Название" required />
        <input name="price" type="number" placeholder="Цена" required />
        <input name="cathegory" placeholder="Категория" required />
        <input name="quantity" type="number" placeholder="Количество" required />
        <button type="submit">Добавить</button>
      </form>
    </body>
    </html>
  `);
});

app.post("/add", (req, res) => {
  const { name, price, cathegory, quantity } = req.body;

  items.push({
    id: Date.now(), // уникальный id
    name,
    price: Number(price),
    cathegory,
    quantity: Number(quantity)
  });

  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  items = items.filter((item) => item.id !== id);

  res.redirect("/");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
