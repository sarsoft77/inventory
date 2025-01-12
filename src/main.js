import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.data('productCatalog', () => ({
  products: [], // Массив для хранения товаров
  newProduct: true, // Режим добавления товара  
  editProduct: null, // Товар для редактирования

  init() {
    this.startAdd(); // Значение по умолчанию при добавлении товара
    this.loadProducts(); // Загрузка товаров при инициализации
  },

  // Функция для загрузки всех товаров
  async loadProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/products'); // Запрос к API для получения товаров
      if (!response.ok) {
        throw new Error('Ошибка при загрузке товаров'); // Обработка ошибок
      }
      this.products = await response.json(); // Преобразуем ответ в JSON и сохраняем в массиве products
      console.log('Список товаров загружен', this.products);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  },

  // Функция для начала ввода нового товара
  startAdd() {
    this.editProduct = {
      name: '',
      quantity: 1,
      price: 0,
    };
    this.newProduct = true
  },

  // Функция для добавления нового товара
  async addProduct() {
    if (this.editProduct.name && this.editProduct.quantity > 0 && this.editProduct.price >= 0) {
      try {
        const response = await fetch('http://localhost:3000/api/products', {
          method: 'POST', // Метод запроса
          headers: {
            'Content-Type': 'application/json' // Указываем тип контента
          },
          body: JSON.stringify(this.editProduct) // Преобразуем новый товар в JSON
        });

        if (!response.ok) {
          throw new Error('Ошибка при добавлении товара'); // Обработка ошибок
        }

        this.loadProducts(); // Обновляем список товаров
        this.editProduct = { name: '', quantity: 1, price: 0 }; // Сбрасываем поля формы
      } catch (error) {
        alert('Ошибка при добавлении товара.');
        console.error(error);
      }
    } else {
      alert('Пожалуйста, заполните все поля корректно.');
    }
  },

  // Функция для начала редактирования товара
  startEdit(product) {
    this.editProduct = { ...product }; // Копируем данные товара для редактирования
    this.newProduct = false
  },

  // Функция для обновления товара
  async updateProduct() {
    if (this.editProduct) {
      console.log('Обновляем товар', this.editProduct);
      try {
        const response = await fetch(`http://localhost:3000/api/products/${this.editProduct.id}`, {
          method: 'PUT', // Метод запроса
          headers: {
            'Content-Type': 'application/json' // Указываем тип контента
          },
          body: JSON.stringify(this.editProduct) // Преобразуем редактируемый товар в JSON
        });

        if (!response.ok) {
          throw new Error('Ошибка при обновлении товара'); // Обработка ошибок
        }

        await this.loadProducts(); // Обновляем список товаров
        this.startAdd(); // Сбрасываем редактируемый товар
      } catch (error) {
        alert('Ошибка при обновлении товара.');
        console.error(error);
      }
    }
  },

  // Функция для удаления товара
  async deleteProduct(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE' // Метод запроса
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении товара'); // Обработка ошибок
      }

      this.loadProducts(); // Обновляем список товаров
    } catch (error) {
      alert('Ошибка при удалении товара.');
      console.error(error);
    }
  }
}));

Alpine.start(); // Запускаем Alpine.js
