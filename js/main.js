// Variables globales
let cart = JSON.parse(localStorage.getItem("cart")) || []
let isDarkMode = localStorage.getItem("darkMode") === "true"

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  initializeNavigation()
  initializeTheme()
  initializeMascot()
  initializeScrollAnimations()
  initializeCursor()

  // Cargar productos destacados en la página principal
  if (document.getElementById("featured-products")) {
    loadFeaturedProducts()
  }
})

// Inicializar tema (funciona en todas las páginas)
function initializeTheme() {
  const themeToggle = document.getElementById("theme-toggle")
  const themeIcon = document.getElementById("theme-icon")

  // Aplicar tema inicial inmediatamente
  applyTheme()

  if (themeToggle && themeIcon) {
    // Event listener para toggle
    themeToggle.addEventListener("click", toggleTheme)
  }
}

// Aplicar tema
function applyTheme() {
  const themeIcon = document.getElementById("theme-icon")

  if (isDarkMode) {
    document.documentElement.classList.add("dark")
    document.body.classList.add("dark")
    if (themeIcon) themeIcon.className = "fas fa-sun text-xl"
  } else {
    document.documentElement.classList.remove("dark")
    document.body.classList.remove("dark")
    if (themeIcon) themeIcon.className = "fas fa-moon text-xl"
  }
}

// Toggle tema dark/light (funciona globalmente)
function toggleTheme() {
  isDarkMode = !isDarkMode
  localStorage.setItem("darkMode", isDarkMode)
  applyTheme()

  // Mostrar toast de confirmación
  showToast(isDarkMode ? "🌙 Tema oscuro activado" : "☀️ Tema claro activado", "success")
}

// Navegación móvil
function initializeNavigation() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const mobileMenu = document.getElementById("mobile-menu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }
}

// Obtener productos destacados de la base de datos real
function getFeaturedProducts() {
  if (typeof products !== "undefined") {
    return products.filter((product) => product.featured)
  }
  return []
}

// Obtener producto por ID de la base de datos real
function getProductById(id) {
  if (typeof products !== "undefined") {
    return products.find((product) => product.id === Number.parseInt(id))
  }
  return null
}

// Cargar productos destacados en carrusel
function loadFeaturedProducts() {
  const featuredProducts = getFeaturedProducts().slice(0, 7)
  const container = document.getElementById("featured-products")

  if (!container || featuredProducts.length === 0) return

  // Crear estructura del carrusel
  container.innerHTML = `
    <div class="relative overflow-hidden">
      <!-- Carrusel -->
      <div class="carousel-container">
        <div id="carousel-track" class="carousel-track">
          ${featuredProducts
            .map(
              (product) => `
            <div class="carousel-slide">
              <div class="mx-3">
                <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group">
                  <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    ${product.featured ? '<span class="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">⭐ Destacado</span>' : ""}
                    ${getStockBadge(product.stock)}
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onclick="addToCart(${product.id})" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-full font-semibold transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <i class="fas fa-cart-plus mr-2"></i>Agregar
                      </button>
                    </div>
                  </div>
                  <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">${product.name}</h3>
                      <span class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">${product.brand}</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">${product.description.substring(0, 80)}...</p>
                    <div class="flex justify-between items-center">
                      <span class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">${formatPrice(product.price)}</span>
                      <a href="producto.html?id=${product.id}" class="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      
      <!-- Controles del carrusel -->
      <button id="carousel-prev" class="carousel-button prev">
        <i class="fas fa-chevron-left text-primary"></i>
      </button>
      <button id="carousel-next" class="carousel-button next">
        <i class="fas fa-chevron-right text-primary"></i>
      </button>
    </div>
    
    <!-- Indicadores -->
    <div class="carousel-indicators">
      ${Array.from(
        { length: Math.ceil(featuredProducts.length / getVisibleSlides()) },
        (_, i) => `
        <button class="carousel-indicator ${i === 0 ? "active" : ""}" data-slide="${i}"></button>
      `,
      ).join("")}
    </div>
  `

  // Inicializar carrusel
  initializeCarousel()
}

// Función para obtener número de slides visibles según el tamaño de pantalla
function getVisibleSlides() {
  if (window.innerWidth >= 1024) return 4
  if (window.innerWidth >= 640) return 2
  return 1
}

// Función para inicializar el carrusel
function initializeCarousel() {
  const track = document.getElementById("carousel-track")
  const prevBtn = document.getElementById("carousel-prev")
  const nextBtn = document.getElementById("carousel-next")
  const indicators = document.querySelectorAll(".carousel-indicator")

  if (!track || !prevBtn || !nextBtn) return

  let currentSlide = 0
  const totalSlides = indicators.length
  const visibleSlides = getVisibleSlides()

  function updateCarousel() {
    const visibleSlides = getVisibleSlides()
    const translateX = -currentSlide * (100 / visibleSlides)
    track.style.transform = `translateX(${translateX}%)`

    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide)
    })

    // Asegurar que el producto esté centrado en móviles
if (window.innerWidth < 640) {
      slides.forEach((slide, index) => {
         const slides = track.querySelectorAll(".carousel-slide")
         if (index === currentSlide) {
           slide.scrollIntoView({
             behavior: "smooth",
             block: "nearest",
             inline: "center",
          })
         }
        })
      }
    }
  // Event listeners
  prevBtn.addEventListener("click", () => {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1
    updateCarousel()
  })

  nextBtn.addEventListener("click", () => {
    currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
    updateCarousel()
  })

  // Indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index
      updateCarousel()
    })
  })

  // Auto-play
let autoPlayInterval

function iniciarAutoPlay() {
  // Solo activar autoplay si no es celular
  if (window.innerWidth >= 640) {
    autoPlayInterval = setInterval(() => {
      currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
      updateCarousel()
    }, 4000)

    // Pausar en hover
    track.addEventListener("mouseenter", () => clearInterval(autoPlayInterval))
    track.addEventListener("mouseleave", () => {
      autoPlayInterval = setInterval(() => {
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
        updateCarousel()
      }, 4000)
    })
  }
}

iniciarAutoPlay()

  // Responsive
  window.addEventListener("resize", () => {
    updateCarousel()
  })
}

// Función para obtener badge de stock
function getStockBadge(stock) {
  if (stock === 0) {
    return '<span class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">❌ Sin Stock</span>'
  } else if (stock <= 5) {
    return `<span class="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">⚠️ ${stock} disponibles</span>`
  } else if (stock <= 10) {
    return `<span class="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">✅ ${stock} disponibles</span>`
  }
  return ""
}

// Funciones del carrito
function addToCart(productId, quantity = 1) {
  const product = getProductById(productId)
  if (!product) {
    showToast("❌ Producto no encontrado", "error")
    return
  }

  if (product.stock === 0) {
    showToast("❌ Producto sin stock", "error")
    return
  }

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showToast(`🛒 ${product.name} agregado al carrito`, "success")
  animateCartIcon()
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showToast("🗑️ Producto eliminado del carrito", "error")
}

function updateCartQuantity(productId, quantity) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartCount()
    }
  }
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems

    // Animar el contador si hay cambios
    if (totalItems > 0) {
      cartCount.classList.add("animate-bounce")
      setTimeout(() => cartCount.classList.remove("animate-bounce"), 1000)
    }
  }
}

function animateCartIcon() {
  const cartIcon = document.querySelector(".fa-shopping-cart")
  if (cartIcon) {
    cartIcon.classList.add("animate-pulse")
    setTimeout(() => cartIcon.classList.remove("animate-pulse"), 1000)
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function clearCart() {
  cart = []
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

// Funciones de utilidad
function formatPrice(price) {
  return `$${price.toLocaleString()}`
}

function showToast(message, type = "success") {
  // Crear toast dinámicamente
  const toast = document.createElement("div")
  toast.className = `fixed top-20 right-4 px-6 py-4 rounded-xl shadow-2xl transform translate-x-full transition-all duration-500 z-50 backdrop-blur-lg ${
    type === "success"
      ? "bg-green-500/90 text-white border border-green-400"
      : "bg-red-500/90 text-white border border-red-400"
  }`

  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <span class="text-lg">${type === "success" ? "✅" : "❌"}</span>
      <span class="font-medium">${message}</span>
    </div>
  `

  document.body.appendChild(toast)

  // Mostrar toast
  setTimeout(() => toast.classList.remove("translate-x-full"), 100)

  // Ocultar después de 3 segundos
  setTimeout(() => {
    toast.classList.add("translate-x-full")
    setTimeout(() => document.body.removeChild(toast), 500)
  }, 3000)
}

// Función para filtrar por categoría desde la página principal
function filterByCategory(category) {
  window.location.href = `productos.html?categoria=${category}`
}

// Función para generar mensaje de WhatsApp
function generateWhatsAppMessage() {
  if (cart.length === 0) return ""

  let message = "🛒 Hola, quiero comprar estos productos:\n\n"

  cart.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`
  })

  message += `\n💰 Total: ${formatPrice(getCartTotal())}`

  return encodeURIComponent(message)
}

// Función para abrir WhatsApp con el pedido
function openWhatsAppOrder() {
  const message = generateWhatsAppMessage()
  const whatsappUrl = `https://wa.me/5491123456789?text=${message}`
  window.open(whatsappUrl, "_blank")
}

// Inicializar mascota with FAQ
function initializeMascot() {
  const mascot = document.getElementById("mascot")
  if (!mascot) return

  const phrases = [
    "¡Hola! ¿Te ayudo a encontrar algo? 🤖",
    "¡Esta heladera tiene 30% OFF! ❄️",
    "¿Necesitas ayuda? ¡Haz clic en mí! 💡",
    "¡Mira estas ofertas increíbles! 🔥",
    "¿Todo bien por aquí? 😊",
  ]

  let currentPhrase = 0

  // Mostrar frase cada 10 segundos
  setInterval(() => {
    const bubble = document.getElementById("mascot-bubble")
    const text = document.getElementById("mascot-text")

    if (bubble && text) {
      text.textContent = phrases[currentPhrase]
      bubble.classList.remove("hidden")
      bubble.classList.add("animate-bounce")

      setTimeout(() => {
        bubble.classList.add("hidden")
        bubble.classList.remove("animate-bounce")
      }, 4000)

      currentPhrase = (currentPhrase + 1) % phrases.length
    }
  }, 10000)

  // Interacción con click - abrir FAQ
  mascot.addEventListener("click", () => {
    openFAQModal()
  })
}

// Inicializar animaciones de scroll
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up")
        entry.target.classList.remove("opacity-0", "translate-y-8")
      }
    })
  }, observerOptions)

  // Observar elementos con la clase scroll-animate
  document.querySelectorAll(".scroll-animate").forEach((el) => {
    el.classList.add("opacity-0", "translate-y-8", "transition-all", "duration-700")
    observer.observe(el)
  })
}

// Inicializar cursor personalizado
function initializeCursor() {
  if (window.innerWidth > 768) {
    // Solo en desktop
    const cursor = document.createElement("div")
    cursor.className = "custom-cursor"
    cursor.innerHTML = "⚡"
    document.body.appendChild(cursor)

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px"
      cursor.style.top = e.clientY + "px"
    })

    // Cambiar cursor en elementos interactivos
    document.querySelectorAll("a, button, .cursor-pointer").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"))
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"))
    })
  }
}

// Inicializar modal FAQ
function initializeFAQModal() {
  // Crear modal FAQ si no existe
  if (!document.getElementById("faq-modal")) {
    const faqModal = document.createElement("div")
    faqModal.id = "faq-modal"
    faqModal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 hidden"

    faqModal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span class="text-2xl">🤖</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Preguntas Frecuentes</h2>
                <p class="text-gray-600 dark:text-gray-400">¡Estoy aquí para ayudarte!</p>
              </div>
            </div>
            <button id="close-faq" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="faq-item">
            <button class="faq-question w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-900 dark:text-white">🚚 ¿Cómo funcionan los envíos?</span>
                <i class="fas fa-chevron-down text-gray-500 transform transition-transform"></i>
              </div>
            </button>
            <div class="faq-answer hidden p-4 text-gray-600 dark:text-gray-300">
              <p>• Envío gratis en compras superiores a $15.000</p>
              <p>• Entrega en 24-48 horas en CABA y GBA</p>
              <p>• Cobertura en todo el país</p>
              <p>• Seguimiento en tiempo real</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-900 dark:text-white">💳 ¿Qué métodos de pago aceptan?</span>
                <i class="fas fa-chevron-down text-gray-500 transform transition-transform"></i>
              </div>
            </button>
            <div class="faq-answer hidden p-4 text-gray-600 dark:text-gray-300">
              <p>• Tarjetas de crédito y débito</p>
              <p>• Transferencia bancaria</p>
              <p>• MercadoPago</p>
              <p>• Efectivo contra entrega</p>
              <p>• Financiación en cuotas sin interés</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-900 dark:text-white">🔧 ¿Tienen garantía los productos?</span>
                <i class="fas fa-chevron-down text-gray-500 transform transition-transform"></i>
              </div>
            </button>
            <div class="faq-answer hidden p-4 text-gray-600 dark:text-gray-300">
              <p>• Garantía oficial de fábrica</p>
              <p>• Servicio técnico autorizado</p>
              <p>• 30 días para cambios y devoluciones</p>
              <p>• Soporte técnico gratuito</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-900 dark:text-white">📱 ¿Cómo hago un pedido?</span>
                <i class="fas fa-chevron-down text-gray-500 transform transition-transform"></i>
              </div>
            </button>
            <div class="faq-answer hidden p-4 text-gray-600 dark:text-gray-300">
              <p>• Navega por nuestros productos</p>
              <p>• Agrega al carrito lo que te guste</p>
              <p>• Haz clic en "Finalizar por WhatsApp"</p>
              <p>• Te contactaremos para confirmar</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-900 dark:text-white">🏠 ¿Hacen instalación?</span>
                <i class="fas fa-chevron-down text-gray-500 transform transition-transform"></i>
              </div>
            </button>
            <div class="faq-answer hidden p-4 text-gray-600 dark:text-gray-300">
              <p>• Instalación gratuita en electrodomésticos grandes</p>
              <p>• Técnicos especializados</p>
              <p>• Coordinamos horario contigo</p>
              <p>• Retiramos tu equipo viejo</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-900 dark:text-white">📞 ¿Cómo los contacto?</span>
                <i class="fas fa-chevron-down text-gray-500 transform transition-transform"></i>
              </div>
            </button>
            <div class="faq-answer hidden p-4 text-gray-600 dark:text-gray-300">
              <p>• WhatsApp: +54 11 2345-6789</p>
              <p>• Email: info@tiendaelectro.com</p>
              <p>• Horario: Lun-Vie 9:00-18:00</p>
              <p>• Respuesta inmediata por WhatsApp</p>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
          <div class="text-center">
            <p class="text-gray-600 dark:text-gray-400 mb-4">¿No encontraste lo que buscabas?</p>
            <a href="https://wa.me/5491123456789?text=Hola, tengo una consulta" target="_blank" class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
              <i class="fab fa-whatsapp mr-2"></i>Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(faqModal)

    // Event listeners para el modal
    const closeBtn = document.getElementById("close-faq")
    const modal = document.getElementById("faq-modal")

    closeBtn.addEventListener("click", closeFAQModal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeFAQModal()
    })

    // Event listeners para las preguntas FAQ
    document.querySelectorAll(".faq-question").forEach((question) => {
      question.addEventListener("click", () => {
        const answer = question.nextElementSibling
        const icon = question.querySelector("i")

        answer.classList.toggle("hidden")
        icon.classList.toggle("rotate-180")
      })
    })
  }
}

// Abrir modal FAQ
function openFAQModal() {
  const modal = document.getElementById("faq-modal")
  if (modal) {
    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"

    // Animar entrada
    setTimeout(() => {
      modal.querySelector("div").classList.add("animate-fade-in-up")
    }, 50)
  }
}

// Cerrar modal FAQ
function closeFAQModal() {
  const modal = document.getElementById("faq-modal")
  if (modal) {
    modal.classList.add("hidden")
    document.body.style.overflow = "auto"
  }
}

// Slogan animado
function initializeAnimatedSlogan() {
  const slogans = [
    "Todo para tu hogar. Todo en un solo lugar ✨",
    "Tecnología que enciende tu vida 💡",
    "Calidad premium, precios increíbles 🏆",
    "Tu hogar inteligente empieza aquí 🏠",
  ]

  const sloganElement = document.getElementById("animated-slogan")
  if (!sloganElement) return

  let currentSlogan = 0

  function updateSlogan() {
    sloganElement.style.opacity = "0"
    sloganElement.style.transform = "translateY(-20px)"

    setTimeout(() => {
      sloganElement.textContent = slogans[currentSlogan]
      sloganElement.style.opacity = "1"
      sloganElement.style.transform = "translateY(0)"
      currentSlogan = (currentSlogan + 1) % slogans.length
    }, 300)
  }

  // Cambiar slogan cada 4 segundos
  setInterval(updateSlogan, 4000)
  updateSlogan() // Mostrar el primero inmediatamente
}

// Inicializar slogan cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializeAnimatedSlogan, 1000)
})

// Inicializar FAQ modal
initializeFAQModal()
