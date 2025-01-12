import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./products.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Подключено к базе данных SQLite.');
});

// Создание таблицы, если она не существует
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL
    )`);
});

// Функция для добавления товара
export const addProduct = (product, callback) => {
  const { name, quantity, price } = product;
  db.run(`INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)`, [name, quantity, price], callback);
};

// Функция для получения всех товаров
export const getProducts = (callback) => {
  db.all(`SELECT * FROM products`, [], callback);
};

// Функция для получения товара по ID
export const getProductById = (id, callback) => {
  const sql = `SELECT * FROM products WHERE id = ?`; // SQL-запрос с параметром
  db.get(sql, [id], (err, row) => { // Используем db.get для получения одной строки
    if (err) {
      return callback(err); // Если произошла ошибка, передаем ее в callback
    }
    callback(null, row); // Если товар найден, передаем его в callback
  });
};

// Функция для обновления товара
export const updateProduct = (product, callback) => {
  const { id, name, quantity, price } = product;
  db.run(`UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?`, [name, quantity, price, id], callback);
};

// Функция для удаления товара
export const deleteProduct = (id, callback) => {
  db.run(`DELETE FROM products WHERE id = ?`, [id], callback);
};

export default db;
