// Variables para filtros
let currentFilters = {
  search: "",
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  inStock: false,
  sort: "name",
}

let allProducts = []
let filteredProducts = []

// Inicialización de la página de productos
document.addEventListener("DOMContentLoaded", () => {
  allProducts = getProducts()
  filteredProducts = [...allProducts]

  // Verificar si hay parámetros en la URL para filtro automático
  const urlParams = new URLSearchParams(window.location.search)
  const categoria = urlParams.get("categoria")

  if (categoria) {
    currentFilters.category = categoria
    // Aplicar filtro en ambos selectores (desktop y móvil)
    const categoryFilter = document.getElementById("category-filter")
    const mobileCategoryFilter = document.getElementById("mobile-category-filter")

    if (categoryFilter) categoryFilter.value = categoria
    if (mobileCategoryFilter) mobileCategoryFilter.value = categoria

    // Mostrar mensaje de filtro aplicado
    showToast(`🔍 Mostrando productos de: ${getCategoryDisplayName(categoria)}`, "success")
  }

  initializeFilters()
  renderProducts()
  updateResultsCount()
})

// Función para obtener nombre de categoría para mostrar
function getCategoryDisplayName(category) {
  const categoryNames = {
    computadoras: "Computadoras",
    celulares: "Celulares",
    heladeras: "Heladeras",
    lavarropas: "Lavarropas",
    cafeteras: "Cafeteras",
    televisores: "Televisores",
    aires: "Aires Acondicionados",
    microondas: "Microondas",
    aspiradoras: "Aspiradoras",
    parlantes: "Parlantes",
  }
  return categoryNames[category] || category
}

// Inicializar filtros
function initializeFilters() {
  // Cargar marcas dinámicamente
  loadBrandOptions()

  // Filtros desktop
  const searchInput = document.getElementById("search-input")
  const categoryFilter = document.getElementById("category-filter")
  const brandFilter = document.getElementById("brand-filter")
  const stockFilter = document.getElementById("stock-filter")
  const minPriceInput = document.getElementById("min-price")
  const maxPriceInput = document.getElementById("max-price")
  const sortFilter = document.getElementById("sort-filter")
  const clearFiltersBtn = document.getElementById("clear-filters")

  // Filtros mobile
  const mobileSearchInput = document.getElementById("mobile-search-input")
  const mobileCategoryFilter = document.getElementById("mobile-category-filter")
  const mobileBrandFilter = document.getElementById("mobile-brand-filter")
  const mobileMinPriceInput = document.getElementById("mobile-min-price")
  const mobileMaxPriceInput = document.getElementById("mobile-max-price")
  const mobileSortFilter = document.getElementById("mobile-sort-filter")
  const mobileClearFiltersBtn = document.getElementById("mobile-clear-filters")

  // Event listeners desktop
  if (searchInput) searchInput.addEventListener("input", handleFilterChange)
  if (categoryFilter) categoryFilter.addEventListener("change", handleFilterChange)
  if (brandFilter) brandFilter.addEventListener("change", handleFilterChange)
  if (stockFilter) stockFilter.addEventListener("change", handleFilterChange)
  if (minPriceInput) minPriceInput.addEventListener("input", handleFilterChange)
  if (maxPriceInput) maxPriceInput.addEventListener("input", handleFilterChange)
  if (sortFilter) sortFilter.addEventListener("change", handleFilterChange)
  if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", clearAllFilters)

  // Event listeners mobile
  if (mobileSearchInput) mobileSearchInput.addEventListener("input", handleMobileFilterChange)
  if (mobileCategoryFilter) mobileCategoryFilter.addEventListener("change", handleMobileFilterChange)
  if (mobileBrandFilter) mobileBrandFilter.addEventListener("change", handleMobileFilterChange)
  if (mobileMinPriceInput) mobileMinPriceInput.addEventListener("input", handleMobileFilterChange)
  if (mobileMaxPriceInput) mobileMaxPriceInput.addEventListener("input", handleMobileFilterChange)
  if (mobileSortFilter) mobileSortFilter.addEventListener("change", handleMobileFilterChange)
  if (mobileClearFiltersBtn) mobileClearFiltersBtn.addEventListener("click", clearAllFilters)

  // Modal de filtros móvil
  const mobileFilterBtn = document.getElementById("mobile-filter-btn")
  const mobileFilterModal = document.getElementById("mobile-filter-modal")
  const mobileFilterPanel = document.getElementById("mobile-filter-panel")
  const closeMobileFilter = document.getElementById("close-mobile-filter")

  if (mobileFilterBtn) {
    mobileFilterBtn.addEventListener("click", () => {
      mobileFilterModal.classList.remove("hidden")
      setTimeout(() => {
        mobileFilterPanel.classList.remove("-translate-x-full")
      }, 10)
    })
  }

  if (closeMobileFilter) {
    closeMobileFilter.addEventListener("click", closeMobileFilterModal)
  }

  if (mobileFilterModal) {
    mobileFilterModal.addEventListener("click", (e) => {
      if (e.target === mobileFilterModal) {
        closeMobileFilterModal()
      }
    })
  }
}

// Cargar opciones de marca
function loadBrandOptions() {
  const brandFilter = document.getElementById("brand-filter")
  const mobileBrandFilter = document.getElementById("mobile-brand-filter")

  if (brandFilter) {
    const brands = getBrands()
    const brandOptions = brands.map((brand) => `<option value="${brand}">${brand}</option>`).join("")
    brandFilter.innerHTML = '<option value="">Todas las marcas</option>' + brandOptions
  }

  if (mobileBrandFilter) {
    const brands = getBrands()
    const brandOptions = brands.map((brand) => `<option value="${brand}">${brand}</option>`).join("")
    mobileBrandFilter.innerHTML = '<option value="">Todas las marcas</option>' + brandOptions
  }
}

// Manejar cambios en filtros desktop
function handleFilterChange() {
  const searchInput = document.getElementById("search-input")
  const categoryFilter = document.getElementById("category-filter")
  const brandFilter = document.getElementById("brand-filter")
  const stockFilter = document.getElementById("stock-filter")
  const minPriceInput = document.getElementById("min-price")
  const maxPriceInput = document.getElementById("max-price")
  const sortFilter = document.getElementById("sort-filter")

  if (searchInput) currentFilters.search = searchInput.value
  if (categoryFilter) currentFilters.category = categoryFilter.value
  if (brandFilter) currentFilters.brand = brandFilter.value
  if (stockFilter) currentFilters.inStock = stockFilter.checked
  if (minPriceInput) currentFilters.minPrice = minPriceInput.value ? Number.parseInt(minPriceInput.value) : ""
  if (maxPriceInput) currentFilters.maxPrice = maxPriceInput.value ? Number.parseInt(maxPriceInput.value) : ""
  if (sortFilter) currentFilters.sort = sortFilter.value

  // Sincronizar con filtros móviles
  syncMobileFilters()

  applyFilters()
}

// Manejar cambios en filtros móviles
function handleMobileFilterChange() {
  const mobileSearchInput = document.getElementById("mobile-search-input")
  const mobileCategoryFilter = document.getElementById("mobile-category-filter")
  const mobileBrandFilter = document.getElementById("mobile-brand-filter")
  const mobileStockFilter = document.getElementById("mobile-stock-filter")
  const mobileMinPriceInput = document.getElementById("mobile-min-price")
  const mobileMaxPriceInput = document.getElementById("mobile-max-price")
  const mobileSortFilter = document.getElementById("mobile-sort-filter")

  if (mobileSearchInput) currentFilters.search = mobileSearchInput.value
  if (mobileCategoryFilter) currentFilters.category = mobileCategoryFilter.value
  if (mobileBrandFilter) currentFilters.brand = mobileBrandFilter.value
  if (mobileStockFilter) currentFilters.inStock = mobileStockFilter.checked
  if (mobileMinPriceInput)
    currentFilters.minPrice = mobileMinPriceInput.value ? Number.parseInt(mobileMinPriceInput.value) : ""
  if (mobileMaxPriceInput)
    currentFilters.maxPrice = mobileMaxPriceInput.value ? Number.parseInt(mobileMaxPriceInput.value) : ""
  if (mobileSortFilter) currentFilters.sort = mobileSortFilter.value

  // Sincronizar con filtros desktop
  syncDesktopFilters()

  applyFilters()
}

// Sincronizar filtros móviles con desktop
function syncMobileFilters() {
  const mobileSearchInput = document.getElementById("mobile-search-input")
  const mobileCategoryFilter = document.getElementById("mobile-category-filter")
  const mobileBrandFilter = document.getElementById("mobile-brand-filter")
  const mobileStockFilter = document.getElementById("mobile-stock-filter")
  const mobileMinPriceInput = document.getElementById("mobile-min-price")
  const mobileMaxPriceInput = document.getElementById("mobile-max-price")
  const mobileSortFilter = document.getElementById("mobile-sort-filter")

  if (mobileSearchInput) mobileSearchInput.value = currentFilters.search
  if (mobileCategoryFilter) mobileCategoryFilter.value = currentFilters.category
  if (mobileBrandFilter) mobileBrandFilter.value = currentFilters.brand
  if (mobileStockFilter) mobileStockFilter.checked = currentFilters.inStock
  if (mobileMinPriceInput) mobileMinPriceInput.value = currentFilters.minPrice
  if (mobileMaxPriceInput) mobileMaxPriceInput.value = currentFilters.maxPrice
  if (mobileSortFilter) mobileSortFilter.value = currentFilters.sort
}

// Sincronizar filtros desktop con móviles
function syncDesktopFilters() {
  const searchInput = document.getElementById("search-input")
  const categoryFilter = document.getElementById("category-filter")
  const brandFilter = document.getElementById("brand-filter")
  const stockFilter = document.getElementById("stock-filter")
  const minPriceInput = document.getElementById("min-price")
  const maxPriceInput = document.getElementById("max-price")
  const sortFilter = document.getElementById("sort-filter")

  if (searchInput) searchInput.value = currentFilters.search
  if (categoryFilter) categoryFilter.value = currentFilters.category
  if (brandFilter) brandFilter.value = currentFilters.brand
  if (stockFilter) stockFilter.checked = currentFilters.inStock
  if (minPriceInput) minPriceInput.value = currentFilters.minPrice
  if (maxPriceInput) maxPriceInput.value = currentFilters.maxPrice
  if (sortFilter) sortFilter.value = currentFilters.sort
}

// Aplicar filtros
function applyFilters() {
  showLoading()

  setTimeout(() => {
    filteredProducts = filterProducts(currentFilters)
    renderProducts()
    updateResultsCount()
    hideLoading()
  }, 300)
}

// Limpiar todos los filtros
function clearAllFilters() {
  currentFilters = {
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
    sort: "name",
  }

  // Limpiar inputs desktop
  const searchInput = document.getElementById("search-input")
  const categoryFilter = document.getElementById("category-filter")
  const brandFilter = document.getElementById("brand-filter")
  const stockFilter = document.getElementById("stock-filter")
  const minPriceInput = document.getElementById("min-price")
  const maxPriceInput = document.getElementById("max-price")
  const sortFilter = document.getElementById("sort-filter")

  if (searchInput) searchInput.value = ""
  if (categoryFilter) categoryFilter.value = ""
  if (brandFilter) brandFilter.value = ""
  if (stockFilter) stockFilter.checked = false
  if (minPriceInput) minPriceInput.value = ""
  if (maxPriceInput) maxPriceInput.value = ""
  if (sortFilter) sortFilter.value = "name"

  // Limpiar inputs móviles
  const mobileSearchInput = document.getElementById("mobile-search-input")
  const mobileCategoryFilter = document.getElementById("mobile-category-filter")
  const mobileBrandFilter = document.getElementById("mobile-brand-filter")
  const mobileStockFilter = document.getElementById("mobile-stock-filter")
  const mobileMinPriceInput = document.getElementById("mobile-min-price")
  const mobileMaxPriceInput = document.getElementById("mobile-max-price")
  const mobileSortFilter = document.getElementById("mobile-sort-filter")

  if (mobileSearchInput) mobileSearchInput.value = ""
  if (mobileCategoryFilter) mobileCategoryFilter.value = ""
  if (mobileBrandFilter) mobileBrandFilter.value = ""
  if (mobileStockFilter) mobileStockFilter.checked = false
  if (mobileMinPriceInput) mobileMinPriceInput.value = ""
  if (mobileMaxPriceInput) mobileMaxPriceInput.value = ""
  if (mobileSortFilter) mobileSortFilter.value = "name"

  // Limpiar URL
  const url = new URL(window.location)
  url.searchParams.delete("categoria")
  window.history.replaceState({}, "", url)

  applyFilters()
  showToast("🧹 Filtros limpiados", "success")
}

// Renderizar productos
function renderProducts() {
  const productsGrid = document.getElementById("products-grid")
  const noResults = document.getElementById("no-results")

  if (filteredProducts.length === 0) {
    if (productsGrid) productsGrid.innerHTML = ""
    if (noResults) noResults.classList.remove("hidden")
    updateResultsCount()
    return
  }

  if (noResults) noResults.classList.add("hidden")

  if (productsGrid) {
    productsGrid.innerHTML = filteredProducts
      .map(
        (product) => `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105 ${product.stock === 0 ? "out-of-stock" : ""}">
          <div class="relative">
              <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
              ${product.featured ? '<span class="featured-badge">Destacado</span>' : ""}
              ${getStockBadge(product.stock)}
          </div>
          <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${product.name}</h3>
                  <span class="brand-badge">${product.brand}</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${product.description.substring(0, 80)}...</p>
              <div class="flex justify-between items-center mb-4">
                  <span class="price-highlight">${formatPrice(product.price)}</span>
                  <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs capitalize">${product.category}</span>
              </div>
              <div class="flex space-x-2">
                  <a href="producto.html?id=${product.id}" class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-center py-2 px-4 rounded-md text-sm transition">
                      Ver más
                  </a>
                  <button onclick="addToCart(${product.id})" ${product.stock === 0 ? "disabled" : ""} class="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md text-sm transition ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}">
                      <i class="fas fa-cart-plus"></i>
                  </button>
              </div>
          </div>
      </div>
    `,
      )
      .join("")
  }
}

// Función para obtener badge de stock
function getStockBadge(stock) {
  if (stock === 0) {
    return '<span class="stock-indicator stock-out">Sin Stock</span>'
  } else if (stock <= 5) {
    return `<span class="stock-indicator stock-low">${stock} disponibles</span>`
  } else if (stock <= 10) {
    return `<span class="stock-indicator stock-available">${stock} disponibles</span>`
  }
  return ""
}

// Actualizar contador de resultados
function updateResultsCount() {
  const resultsCount = document.getElementById("results-count")
  if (resultsCount) {
    const count = filteredProducts.length
    const total = allProducts.length

    if (currentFilters.category) {
      const categoryName = getCategoryDisplayName(currentFilters.category)
      resultsCount.textContent = `Mostrando ${count} productos de ${categoryName}`
    } else {
      resultsCount.textContent = `Mostrando ${count} de ${total} productos`
    }
  }
}

// Mostrar loading
function showLoading() {
  const loading = document.getElementById("loading")
  const productsGrid = document.getElementById("products-grid")

  if (loading && productsGrid) {
    loading.classList.remove("hidden")
    productsGrid.style.opacity = "0.5"
  }
}

// Ocultar loading
function hideLoading() {
  const loading = document.getElementById("loading")
  const productsGrid = document.getElementById("products-grid")

  if (loading && productsGrid) {
    loading.classList.add("hidden")
    productsGrid.style.opacity = "1"
  }
}

// Cerrar modal de filtros móvil
function closeMobileFilterModal() {
  const mobileFilterModal = document.getElementById("mobile-filter-modal")
  const mobileFilterPanel = document.getElementById("mobile-filter-panel")

  if (mobileFilterPanel) mobileFilterPanel.classList.add("-translate-x-full")
  setTimeout(() => {
    if (mobileFilterModal) mobileFilterModal.classList.add("hidden")
  }, 300)
}

// Toast para productos
function showToast(message, type = "success") {
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

  setTimeout(() => toast.classList.remove("translate-x-full"), 100)

  setTimeout(() => {
    toast.classList.add("translate-x-full")
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 500)
  }, 3000)
}

// Funciones reales (reemplazar las mock)
function getProducts() {
  return typeof products !== "undefined" ? products : []
}

function filterProducts(filters) {
  let filteredProducts = [...getProducts()]

  if (filters.category) {
    filteredProducts = filteredProducts.filter((product) => product.category === filters.category)
  }

  if (filters.brand) {
    filteredProducts = filteredProducts.filter((product) => product.brand === filters.brand)
  }

  if (filters.minPrice) {
    filteredProducts = filteredProducts.filter((product) => product.price >= filters.minPrice)
  }

  if (filters.maxPrice) {
    filteredProducts = filteredProducts.filter((product) => product.price <= filters.maxPrice)
  }

  if (filters.search) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase()),
    )
  }

  if (filters.inStock) {
    filteredProducts = filteredProducts.filter((product) => product.stock > 0)
  }

  // Ordenar productos
  if (filters.sort) {
    switch (filters.sort) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "brand":
        filteredProducts.sort((a, b) => a.brand.localeCompare(b.brand))
        break
    }
  }

  return filteredProducts
}

function formatPrice(price) {
  return `$${price.toLocaleString()}`
}

function getBrands() {
  const allProducts = getProducts()
  return [...new Set(allProducts.map((product) => product.brand))].sort()
}

function getBrandsByCategory(category) {
  const allProducts = getProducts()
  return [
    ...new Set(allProducts.filter((product) => product.category === category).map((product) => product.brand)),
  ].sort()
}
