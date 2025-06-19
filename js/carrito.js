// Inicialización de la página de carrito
document.addEventListener("DOMContentLoaded", () => {
  renderCart()
  initializeCartControls()
})

// Obtener carrito del localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []
}

// Guardar carrito en localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Función para formatear precio
function formatPrice(price) {
  return `$${price.toLocaleString()}`
}

// Función para actualizar cantidad en el carrito
function updateCartQuantity(productId, newQuantity) {
  const cart = getCart()
  const itemIndex = cart.findIndex((item) => item.id === productId)

  if (itemIndex !== -1) {
    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = newQuantity
    }
    saveCart(cart)
    renderCart()
    updateCartCount()
  }
}

// Función para eliminar producto del carrito
function removeFromCart(productId) {
  let cart = getCart()
  cart = cart.filter((item) => item.id !== productId)
  saveCart(cart)
  renderCart()
  updateCartCount()
}

// Función para obtener total del carrito
function getCartTotal() {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Función para generar mensaje de WhatsApp
function generateWhatsAppMessage() {
  const cart = getCart()
  if (cart.length === 0) return ""

  let message = "🛒 Hola, quiero comprar estos productos:\n\n"

  cart.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`
  })

  const subtotal = getCartTotal()
  message += `\n💰 Subtotal: ${formatPrice(subtotal)}\n`
  message += `🚚 Envío: Gratis\n`
  message += `💳 Total: ${formatPrice(subtotal)}\n\n`
  message += `¡Gracias por elegir Tienda Electro! 🏠✨`

  return encodeURIComponent(message)
}

// Función para actualizar contador del carrito
function updateCartCount() {
  const cart = getCart()
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

// Renderizar carrito
function renderCart() {
  const cart = getCart()
  const cartItemsContainer = document.getElementById("cart-items")
  const emptyCart = document.getElementById("empty-cart")

  if (cart.length === 0) {
    if (cartItemsContainer) cartItemsContainer.innerHTML = ""
    if (emptyCart) emptyCart.classList.remove("hidden")
    updateCartSummary()
    return
  }

  if (emptyCart) emptyCart.classList.add("hidden")

  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="flex items-center py-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg mr-4 shadow-md">
            
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${item.name}</h3>
                <p class="text-gray-600 dark:text-gray-400">${formatPrice(item.price)} c/u</p>
            </div>
            
            <div class="flex items-center space-x-4">
                <!-- Controles de cantidad -->
                <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                    <button onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})" 
                            class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors ${item.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="px-4 py-2 border-l border-r border-gray-300 dark:border-gray-600 font-semibold text-gray-900 dark:text-white">${item.quantity}</span>
                    <button onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})" 
                            class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <!-- Subtotal -->
                <div class="text-right min-w-[100px]">
                    <p class="text-lg font-bold text-primary">${formatPrice(item.price * item.quantity)}</p>
                </div>
                
                <!-- Botón eliminar -->
                <button onclick="removeItemFromCart(${item.id})" 
                        class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 transition-colors transform hover:scale-110">
                    <i class="fas fa-trash text-lg"></i>
                </button>
            </div>
        </div>
    `,
      )
      .join("")
  }

  updateCartSummary()
}

// Actualizar cantidad de item
function updateItemQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeItemFromCart(productId)
    return
  }

  updateCartQuantity(productId, newQuantity)
}

// Eliminar item del carrito
function removeItemFromCart(productId) {
  removeFromCart(productId)

  // Mostrar toast
  showCartToast("🗑️ Producto eliminado del carrito", "error")

  // Si el carrito queda vacío, mostrar mensaje
  const cart = getCart()
  if (cart.length === 0) {
    setTimeout(() => {
      showCartToast("🛒 Carrito vacío", "info")
    }, 500)
  }
}

// Actualizar resumen del carrito
function updateCartSummary() {
  const subtotal = getCartTotal()
  const shipping = subtotal >= 15000 ? 0 : 0 // Envío gratis siempre por ahora
  const total = subtotal + shipping

  const subtotalElement = document.getElementById("subtotal")
  const shippingElement = document.getElementById("shipping")
  const totalElement = document.getElementById("total")

  if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal)
  if (shippingElement) shippingElement.textContent = shipping === 0 ? "Gratis" : formatPrice(shipping)
  if (totalElement) totalElement.textContent = formatPrice(total)
}

// Inicializar controles del carrito
function initializeCartControls() {
  const checkoutBtn = document.getElementById("checkout-whatsapp")

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart()
      if (cart.length === 0) {
        showCartToast("❌ El carrito está vacío", "error")
        return
      }

      const message = generateWhatsAppMessage()
      const whatsappUrl = `https://wa.me/5491125068477?text=${message}`
      window.open(whatsappUrl, "_blank")

      // Mostrar confirmación
      showCartToast("✅ Redirigiendo a WhatsApp...", "success")
    })
  }
}

// Toast específico para carrito
function showCartToast(message, type = "success") {
  // Crear toast dinámicamente
  const toast = document.createElement("div")
  toast.className = `fixed top-20 right-4 px-6 py-4 rounded-xl shadow-2xl transform translate-x-full transition-all duration-500 z-50 backdrop-blur-lg ${
    type === "success"
      ? "bg-green-500/90 text-white border border-green-400"
      : type === "error"
        ? "bg-red-500/90 text-white border border-red-400"
        : "bg-blue-500/90 text-white border border-blue-400"
  }`

  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <span class="text-lg">${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</span>
      <span class="font-medium">${message}</span>
    </div>
  `

  document.body.appendChild(toast)

  // Mostrar toast
  setTimeout(() => toast.classList.remove("translate-x-full"), 100)

  // Ocultar después de 3 segundos
  setTimeout(() => {
    toast.classList.add("translate-x-full")
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 500)
  }, 3000)
}

// Inicializar contador al cargar la página
updateCartCount()
