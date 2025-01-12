import express from 'express'; // Импортируем библиотеку Express
import bodyParser from 'body-parser'; // Импортируем middleware для парсинга тела запроса
import cors from 'cors'; // Импортируем пакет cors
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from './database.js'; // Импортируем функции для работы с базой данных

const app = express(); // Создаем экземпляр приложения Express
const PORT = 3000; // Порт, на котором будет работать сервер

app.use(cors()); // Включаем CORS для всех маршрутов
app.use(bodyParser.json()); // Используем middleware для парсинга JSON в теле запроса

// Получение всех товаров
app.get('/api/products', (req, res) => {
  getProducts((err, rows) => { // Вызываем функцию для получения товаров
    if (err) {
      return res.status(500).json({ error: err.message }); // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
    }
    res.json(rows); // Отправляем полученные товары в формате JSON
  });
});

// Добавление нового товара
app.post('/api/products', (req, res) => {
  addProduct(req.body, (err) => { // Вызываем функцию для добавления товара с данными из тела запроса
    if (err) {
      return res.status(500).json({ error: err.message }); // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
    }
    res.status(201).json({ message: 'Товар добавлен' }); // Отправляем статус 201 и сообщение об успешном добавлении
  });
});


// Обновление товара
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id; // Получаем ID товара из параметров запроса

  // Проверяем, есть ли у нас такой товар
  // Для этого вызываем функция для получения товара по ID
  getProductById(productId, (err, existingProduct) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
    }
    if (!existingProduct) {
      return res.status(404).json({ error: 'Товар не найден' }); // Если товар не найден, отправляем статус 404
    }
    // Если товар найден, создаем объект товара для обновления
    const productData = { id: productId, ...req.body }; // Создаем объект товара для обновления
    updateProduct(productData, (err) => { // Вызываем функцию для обновления товара
      if (err) {
        return res.status(500).json({ error: err.message }); // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
      }
      console.log('Товар обновлен', req.body); // Отправляем сообщение об успешном обновлении
      res.status(200).json({ message: 'Товар успешно обновлен' }); // Возвращаем успешный ответ
    });
  });
});

// Удаление товара
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id; // Получаем ID товара из параметров запроса
  deleteProduct(productId, (err) => { // Вызываем функцию для удаления товара
    if (err) {
      return res.status(500).json({ error: err.message }); // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
    }
    res.json({ message: 'Товар удален', }); // Отправляем сообщение об успешном удалении
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`); // Выводим сообщение о запуске сервера
});
