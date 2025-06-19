// Variables globales para la página de producto
let currentProduct = null
let currentQuantity = 1

// Funciones simuladas para obtener datos (reemplazar con llamadas a API reales)
function getProductById(id) {
  // Simulación de datos de productos
  const products = [
    {
      id: 1,
      name: "Producto 1",
      price: 25.99,
      description: "Descripción del Producto 1",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Electrónicos",
      specs: {
        Marca: "Marca A",
        Modelo: "Modelo X",
        Tamaño: "15 pulgadas",
      },
    },
    {
      id: 2,
      name: "Producto 2",
      price: 49.99,
      description: "Descripción del Producto 2",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Ropa",
      specs: {
        Material: "Algodón",
        Talla: "M",
        Color: "Azul",
      },
    },
    {
      id: 3,
      name: "Producto 3",
      price: 19.99,
      description: "Descripción del Producto 3",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Electrónicos",
      specs: {
        Marca: "Marca B",
        Modelo: "Modelo Y",
        Tamaño: "13 pulgadas",
      },
    },
    {
      id: 4,
      name: "Producto 4",
      price: 79.99,
      description: "Descripción del Producto 4",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Hogar",
      specs: {
        Material: "Madera",
        Estilo: "Moderno",
        Dimensiones: "120x60 cm",
      },
    },
    {
      id: 5,
      name: "Producto 5",
      price: 39.99,
      description: "Descripción del Producto 5",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Ropa",
      specs: {
        Material: "Poliéster",
        Talla: "L",
        Color: "Rojo",
      },
    },
    {
      id: 6,
      name: "Producto 6",
      price: 59.99,
      description: "Descripción del Producto 6",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Hogar",
      specs: {
        Material: "Metal",
        Estilo: "Industrial",
        Dimensiones: "80x40 cm",
      },
    },
  ]
  return products.find((product) => product.id === id) || null
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

function addToCart(productId, quantity) {
  console.log(`Producto ${productId} agregado al carrito con cantidad ${quantity}`)
  // Aquí iría la lógica real para agregar al carrito
}

function getProductsByCategory(category) {
  // Simulación de filtrado por categoría
  const products = [
    {
      id: 1,
      name: "Producto 1",
      price: 25.99,
      description: "Descripción del Producto 1",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Electrónicos",
      specs: {
        Marca: "Marca A",
        Modelo: "Modelo X",
        Tamaño: "15 pulgadas",
      },
    },
    {
      id: 2,
      name: "Producto 2",
      price: 49.99,
      description: "Descripción del Producto 2",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Ropa",
      specs: {
        Material: "Algodón",
        Talla: "M",
        Color: "Azul",
      },
    },
    {
      id: 3,
      name: "Producto 3",
      price: 19.99,
      description: "Descripción del Producto 3",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Electrónicos",
      specs: {
        Marca: "Marca B",
        Modelo: "Modelo Y",
        Tamaño: "13 pulgadas",
      },
    },
    {
      id: 4,
      name: "Producto 4",
      price: 79.99,
      description: "Descripción del Producto 4",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Hogar",
      specs: {
        Material: "Madera",
        Estilo: "Moderno",
        Dimensiones: "120x60 cm",
      },
    },
    {
      id: 5,
      name: "Producto 5",
      price: 39.99,
      description: "Descripción del Producto 5",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Ropa",
      specs: {
        Material: "Poliéster",
        Talla: "L",
        Color: "Rojo",
      },
    },
    {
      id: 6,
      name: "Producto 6",
      price: 59.99,
      description: "Descripción del Producto 6",
      image: "https://via.placeholder.com/400x300",
      images: ["https://via.placeholder.com/100x80", "https://via.placeholder.com/100x80"],
      category: "Hogar",
      specs: {
        Material: "Metal",
        Estilo: "Industrial",
        Dimensiones: "80x40 cm",
      },
    },
  ]
  return products.filter((product) => product.category === category)
}

// Inicialización de la página de producto
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (productId) {
    loadProduct(Number.parseInt(productId))
  } else {
    // Redirigir a productos si no hay ID
    window.location.href = "productos.html"
  }

  initializeProductControls()
})

// Cargar producto
function loadProduct(productId) {
  currentProduct = getProductById(productId)

  if (!currentProduct) {
    // Producto no encontrado, redirigir
    window.location.href = "productos.html"
    return
  }

  renderProduct()
  loadRelatedProducts()
}

// Renderizar producto
function renderProduct() {
  // Actualizar breadcrumb
  document.getElementById("breadcrumb-product").textContent = currentProduct.name

  // Actualizar título de la página
  document.title = `TiendaOnline - ${currentProduct.name}`

  // Imagen principal
  document.getElementById("main-image").src = currentProduct.image
  document.getElementById("main-image").alt = currentProduct.name

  // Miniaturas
  const thumbnailContainer = document.getElementById("thumbnail-images")
  thumbnailContainer.innerHTML = currentProduct.images
    .map(
      (image, index) => `
        <img src="${image}" alt="${currentProduct.name}" 
             class="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition ${index === 0 ? "ring-2 ring-primary" : ""}"
             onclick="changeMainImage('${image}', this)">
    `,
    )
    .join("")

  // Información del producto
  document.getElementById("product-name").textContent = currentProduct.name
  document.getElementById("product-price").textContent = formatPrice(currentProduct.price)
  document.getElementById("product-description").textContent = currentProduct.description

  // Especificaciones
  const specsContainer = document.getElementById("product-specs")
  specsContainer.innerHTML = Object.entries(currentProduct.specs)
    .map(
      ([key, value]) => `
        <div class="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span class="font-medium text-gray-700">${key}:</span>
            <span class="text-gray-600">${value}</span>
        </div>
    `,
    )
    .join("")
}

// Cambiar imagen principal
function changeMainImage(imageSrc, thumbnail) {
  document.getElementById("main-image").src = imageSrc

  // Actualizar estado de miniaturas
  const thumbnails = document.querySelectorAll("#thumbnail-images img")
  thumbnails.forEach((thumb) => thumb.classList.remove("ring-2", "ring-primary"))
  thumbnail.classList.add("ring-2", "ring-primary")
}

// Inicializar controles del producto
function initializeProductControls() {
  // Controles de cantidad
  const decreaseBtn = document.getElementById("decrease-qty")
  const increaseBtn = document.getElementById("increase-qty")
  const quantityInput = document.getElementById("quantity")

  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      if (currentQuantity > 1) {
        currentQuantity--
        quantityInput.value = currentQuantity
      }
    })
  }

  if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
      currentQuantity++
      quantityInput.value = currentQuantity
    })
  }

  if (quantityInput) {
    quantityInput.addEventListener("change", function () {
      const value = Number.parseInt(this.value)
      if (value >= 1) {
        currentQuantity = value
      } else {
        this.value = 1
        currentQuantity = 1
      }
    })
  }

  // Botón agregar al carrito
  const addToCartBtn = document.getElementById("add-to-cart-btn")
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      if (currentProduct) {
        addToCart(currentProduct.id, currentQuantity)
        showProductToast("Producto agregado al carrito", "success")
      }
    })
  }

  // Botón comprar ahora
  const buyNowBtn = document.getElementById("buy-now-btn")
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      if (currentProduct) {
        // Agregar al carrito temporalmente
        addToCart(currentProduct.id, currentQuantity)

        // Generar mensaje de WhatsApp
        const message = `Hola, quiero comprar:\n\n• ${currentQuantity}x ${currentProduct.name} - ${formatPrice(currentProduct.price * currentQuantity)}\n\nTotal: ${formatPrice(currentProduct.price * currentQuantity)}`
        const whatsappUrl = `https://wa.me/5491125068477?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, "_blank")
      }
    })
  }
}

// Cargar productos relacionados
function loadRelatedProducts() {
  if (!currentProduct) return

  // Obtener productos de la misma categoría (excluyendo el actual)
  const relatedProducts = getProductsByCategory(currentProduct.category)
    .filter((product) => product.id !== currentProduct.id)
    .slice(0, 4)

  const relatedContainer = document.getElementById("related-products")

  if (relatedProducts.length === 0) {
    relatedContainer.innerHTML =
      '<p class="text-gray-500 text-center col-span-full">No hay productos relacionados disponibles.</p>'
    return
  }

  relatedContainer.innerHTML = relatedProducts
    .map(
      (product) => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-3">${product.description.substring(0, 60)}...</p>
                <div class="flex justify-between items-center mb-3">
                    <span class="text-xl font-bold text-primary">${formatPrice(product.price)}</span>
                </div>
                <div class="flex space-x-2">
                    <a href="producto.html?id=${product.id}" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 px-3 rounded-md text-sm transition">
                        Ver
                    </a>
                    <button onclick="addToCart(${product.id})" class="bg-primary hover:bg-secondary text-white py-2 px-3 rounded-md text-sm transition">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Toast específico para página de producto
function showProductToast(message, type = "success") {
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toast-message")

  if (toast && toastMessage) {
    toastMessage.textContent = message

    // Cambiar color según el tipo
    toast.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`

    // Mostrar toast
    toast.classList.remove("translate-x-full")

    // Ocultar después de 3 segundos
    setTimeout(() => {
      toast.classList.add("translate-x-full")
    }, 3000)
  }
}
