// Elementos del DOM / DOM elements
const productList = document.querySelector("#product-list");
const cartCount = document.querySelector("#cart-count");

const openCartButton = document.querySelector("#open-cart-button");

const closeCartButton = document.querySelector("#close-cart-button");

const cartPanel = document.querySelector("#cart-panel");
const cartOverlay = document.querySelector("#cart-overlay");

const cartItems = document.querySelector("#cart-items");

const cartTotalPrice = document.querySelector("#cart-total-price");

const checkoutButton = document.querySelector("#checkout-button");

const checkoutOverlay = document.querySelector("#checkout-overlay");

const checkoutModal = document.querySelector("#checkout-modal");

const closeCheckoutButton = document.querySelector("#close-checkout-button");

const checkoutForm = document.querySelector("#checkout-form");

const checkoutTotalPrice = document.querySelector("#checkout-total-price");

const customerNameInput = document.querySelector("#customer-name");

const customerEmailInput = document.querySelector("#customer-email");

const customerDocumentInput = document.querySelector("#customer-document");

const customerAddressInput = document.querySelector("#customer-address");

const checkoutMessage = document.querySelector("#checkout-message");

const confirmPurchaseButton = document.querySelector(
  "#confirm-purchase-button",
);
const productSearch = document.querySelector("#product-search");

const categoryFilters = document.querySelectorAll(".category-filter");

const catalogResults = document.querySelector("#catalog-results");

checkoutForm.noValidate = true;
// Datos de la aplicación / Application data
let products = [];
const cart = [];
let buyerData = null;
// datos en null porque inicialmente el comprador no tiene datos

let searchTerm = "";
let selectedCategory = "todos";

const CART_STORAGE_KEY = "erland-watches-cart";

const PURCHASE_PROCESSING_SECONDS = 5;
// Define la duración de la simulación
let purchaseTimerId = null;
let isProcessingPurchase = false;

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});
// Formatea un número como moneda peruana.
// Formats a number as Peruvian currency.
const formatCurrency = (value) => {
  return currencyFormatter.format(value);
};

// Muestra un mensaje dentro del formulario de compra.
// Shows a message inside the checkout form.
const showCheckoutMessage = (message, type = "info") => {
  checkoutMessage.textContent = message;

  checkoutMessage.classList.remove("is-error", "is-processing", "is-success");

  if (type === "error") {
    checkoutMessage.classList.add("is-error");
  }

  if (type === "processing") {
    checkoutMessage.classList.add("is-processing");
  }

  if (type === "success") {
    checkoutMessage.classList.add("is-success");
  }
};

// Limpia el mensaje del formulario.
// Clears the checkout form message.
const clearCheckoutMessage = () => {
  checkoutMessage.textContent = "";

  checkoutMessage.classList.remove("is-error", "is-processing", "is-success");
};

// Genera un número para identificar la venta.
// Generates a number to identify the sale.
const createSaleNumber = () => {
  const timestamp = Date.now().toString().slice(-8);

  const randomNumber = Math.floor(100 + Math.random() * 900);

  return `EW-${timestamp}-${randomNumber}`;
};

// Crea la estructura visual del ticket.
// Creates the visual ticket structure.
const createSaleTicketNode = (sale) => {
  const ticket = document.createElement("article");
  const ticketHeader = document.createElement("div");
  const ticketTitle = document.createElement("h3");
  const ticketStatus = document.createElement("p");

  const saleInformation = document.createElement("div");
  const saleNumber = document.createElement("p");
  const saleDate = document.createElement("p");

  const customerInformation = document.createElement("div");
  const customerTitle = document.createElement("h4");
  const customerName = document.createElement("p");
  const customerDocument = document.createElement("p");
  const customerEmail = document.createElement("p");
  const customerAddress = document.createElement("p");

  const productsTitle = document.createElement("h4");
  const productsList = document.createElement("ul");

  const ticketTotal = document.createElement("p");

  ticket.classList.add("sale-ticket");
  ticketHeader.classList.add("sale-ticket-header");
  ticketStatus.classList.add("sale-ticket-status");

  saleInformation.classList.add("sale-ticket-information");
  customerInformation.classList.add("sale-ticket-customer");

  productsList.classList.add("sale-ticket-products");
  ticketTotal.classList.add("sale-ticket-total");

  ticketTitle.textContent = "Erland Watches";
  ticketStatus.textContent = "Compra realizada correctamente";

  saleNumber.textContent = `Operación: ${sale.numero}`;

  saleDate.textContent = `Fecha: ${sale.fecha}`;

  customerTitle.textContent = "Datos del comprador";
  customerName.textContent = `Cliente: ${sale.comprador.nombre}`;

  customerDocument.textContent = `Documento: ${sale.comprador.documento}`;

  customerEmail.textContent = `Correo: ${sale.comprador.correo}`;

  customerAddress.textContent = `Dirección: ${sale.comprador.direccion}`;

  productsTitle.textContent = "Productos";

  sale.productos.forEach((product) => {
    const productItem = document.createElement("li");
    const productName = document.createElement("span");
    const productSubtotal = document.createElement("strong");

    const subtotal = product.precio * product.cantidad;

    productName.textContent = `${product.cantidad} × ${product.nombre}`;

    productSubtotal.textContent = formatCurrency(subtotal);

    productItem.append(productName, productSubtotal);

    productsList.append(productItem);
  });

  ticketTotal.textContent = `Total pagado: ${formatCurrency(sale.total)}`;

  ticketHeader.append(ticketTitle, ticketStatus);

  saleInformation.append(saleNumber, saleDate);

  customerInformation.append(
    customerTitle,
    customerName,
    customerDocument,
    customerEmail,
    customerAddress,
  );

  ticket.append(
    ticketHeader,
    saleInformation,
    customerInformation,
    productsTitle,
    productsList,
    ticketTotal,
  );

  return ticket;
};

// Muestra el ticket final mediante Toastify.
// Shows the final ticket using Toastify.
const showSaleTicket = (sale) => {
  const ticketNode = createSaleTicketNode(sale);

  window
    .Toastify({
      node: ticketNode,
      duration: 15000,
      gravity: "top",
      position: "right",
      close: true,
      stopOnFocus: true,
      className: "sale-ticket-toast",
      style: {
        background: "#ffffff",
        color: "#222222",
        maxWidth: "420px",
      },
    })
    .showToast();
};

// Finaliza la venta y restablece la aplicación.
// Completes the sale and resets the application.
const completePurchase = () => {
  if (!buyerData || cart.length === 0) {
    return;
  }

  const formattedDate = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  const sale = {
    numero: createSaleNumber(),
    fecha: formattedDate,

    comprador: {
      ...buyerData,
    },

    productos: cart.map((product) => ({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: product.cantidad,
    })), //map() crea un nuevo array con los productos
    // que formarán parte del ticket.

    total: calculateCartTotal(),
  };

  closeCheckout();
  showSaleTicket(sale);

  cart.splice(0, cart.length); //Elimina todos los elementos del array sin reemplazarlo por otro array

  buyerData = null;

  checkoutForm.reset();
  clearCheckoutMessage();

  confirmPurchaseButton.disabled = false;
  confirmPurchaseButton.textContent = "Confirmar compra";

  updateCart();
};

// Simula el procesamiento de la compra.
// Simulates the purchase processing.
const startPurchaseTimer = () => {
  if (isProcessingPurchase) {
    return;
    // Si el proceso ya está activo,
    // la función termina y no inicia otro temporizador.
  }

  isProcessingPurchase = true;

  confirmPurchaseButton.disabled = true; //boton deshabilitado
  confirmPurchaseButton.textContent = "Procesando compra..."; //cambia de nombre

  let remainingSeconds = PURCHASE_PROCESSING_SECONDS;

  showCheckoutMessage(
    `Procesando tu compra... ${remainingSeconds} segundos`,
    "processing",
  );

  purchaseTimerId = window.setInterval(() => {
    remainingSeconds -= 1;

    if (remainingSeconds > 0) {
      const timeUnit = remainingSeconds === 1 ? "segundo" : "segundos";

      showCheckoutMessage(
        `Procesando tu compra... ${remainingSeconds} ${timeUnit}`,
        "processing",
      );

      return;
    }

    window.clearInterval(purchaseTimerId);

    purchaseTimerId = null;
    isProcessingPurchase = false;

    completePurchase();
  }, 1000);
};

// Muestra una notificación con Toastify.
// Shows a notification using Toastify.
const showToast = (message, type = "success") => {
  const backgroundByType = {
    success: "linear-gradient(135deg, #1f7a4c, #14532d)",
    //Producto agregado o compra completada
    warning: "linear-gradient(135deg, #c89b3c, #9a7225)",
    //Stock máximo
    error: "linear-gradient(135deg, #b42318, #7a1710)",
    //Problemas en la operación
  };

  window
    .Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      stopOnFocus: true,
      style: {
        background: backgroundByType[type] ?? backgroundByType.success,
      },
    })
    .showToast();
};

// Abre el panel lateral del carrito.
// Opens the cart side panel.
const openCart = () => {
  cartPanel.classList.add("is-open");
  cartOverlay.classList.add("is-visible");

  cartPanel.setAttribute("aria-hidden", "false");
  cartOverlay.setAttribute("aria-hidden", "false");

  document.body.classList.add("cart-open");
};

// Cierra el panel lateral del carrito.
// Closes the cart side panel.
const closeCart = () => {
  cartPanel.classList.remove("is-open");
  cartOverlay.classList.remove("is-visible");

  cartPanel.setAttribute("aria-hidden", "true");
  cartOverlay.setAttribute("aria-hidden", "true");

  document.body.classList.remove("cart-open");
};

// Abre el formulario de compra.
// Opens the checkout form.
const openCheckout = () => {
  if (cart.length === 0) {
    return;
  }
  clearCheckoutMessage();

  const total = calculateCartTotal();

  checkoutTotalPrice.textContent = `S/ ${total.toFixed(2)}`;

  checkoutModal.classList.add("is-open");
  checkoutOverlay.classList.add("is-visible");

  checkoutModal.setAttribute("aria-hidden", "false");
  checkoutOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("checkout-open");

  customerNameInput.focus();
};

// Cierra el formulario de compra.
// Closes the checkout form.
const closeCheckout = () => {
  if (isProcessingPurchase) {
    return; //Mientras dure la cuenta regresiva, el formulario no podrá cerrarse
  }
  checkoutModal.classList.remove("is-open");
  checkoutOverlay.classList.remove("is-visible");

  checkoutModal.setAttribute("aria-hidden", "true");
  checkoutOverlay.setAttribute("aria-hidden", "true");

  document.body.classList.remove("checkout-open");
};

// Valida los datos ingresados por el comprador.
// Validates the customer information.
const handleCheckoutSubmit = (event) => {
  event.preventDefault();

  if (isProcessingPurchase) {
    return; //protección adicional en JavaScript.
  }

  clearCheckoutMessage();

  const formData = new FormData(checkoutForm);

  const customerName = String(formData.get("customerName")).trim();

  const customerEmail = String(formData.get("customerEmail")).trim();

  const customerDocument = String(formData.get("customerDocument")).trim();

  const customerAddress = String(formData.get("customerAddress")).trim();

  if (customerName.length < 3) {
    showCheckoutMessage(
      "Ingresa un nombre válido de al menos 3 caracteres.",
      "error",
    );

    customerNameInput.focus();
    return;
  }

  //Para validar el correo
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(customerEmail)) {
    showCheckoutMessage("Ingresa un correo electrónico válido.", "error");

    customerEmailInput.focus();
    return;
  }
  //validar el documento
  const documentPattern = /^\d{8,12}$/;

  if (!documentPattern.test(customerDocument)) {
    showCheckoutMessage(
      "El documento debe contener entre 8 y 12 números.",
      "error",
    );

    customerDocumentInput.focus();
    return;
  }

  if (customerAddress.length < 5) {
    showCheckoutMessage("Ingresa una dirección de entrega válida.", "error");

    customerAddressInput.focus();
    return;
  }

  buyerData = {
    nombre: customerName,
    correo: customerEmail,
    documento: customerDocument,
    direccion: customerAddress,
  };

  startPurchaseTimer();
};

// Eventos del carrito / Cart events
openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutButton.addEventListener("click", () => {
  closeCart();
  openCheckout();
});

checkoutForm.addEventListener("submit", handleCheckoutSubmit);

closeCheckoutButton.addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", closeCheckout);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (checkoutModal.classList.contains("is-open")) {
    closeCheckout();
    return;
  }

  if (cartPanel.classList.contains("is-open")) {
    closeCart();
  }
});

productSearch.addEventListener("input", (event) => {
  searchTerm = event.currentTarget.value;

  applyCatalogFilters();
});

categoryFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    selectedCategory = filterButton.dataset.category;

    categoryFilters.forEach((button) => {
      button.classList.toggle("is-active", button === filterButton);
    });

    applyCatalogFilters();
  });
}); //Botones por categoria

// Obtiene los productos desde el archivo JSON.
// Gets the products from the JSON file.

const getProducts = async () => {
  productList.textContent = "Cargando relojes..";

  try {
    const response = await fetch("../data/products.json");
    if (!response.ok) {
      throw new Error("No se pudieron cargar los productos.");
    }
    products = await response.json();
    applyCatalogFilters();
    restoreCart();
  } catch (error) {
    productList.textContent = "Ocurrió un problema al cargar los relojes.";
  }
};

// Guarda el carrito en el almacenamiento local.
// Saves the cart in local storage.
const saveCart = () => {
  if (cart.length === 0) {
    localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }

  const cartToSave = cart.map((product) => ({
    id: product.id,
    cantidad: product.cantidad,
  }));

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
};

// Restaura el carrito usando los productos actuales.
// Restores the cart using the current products.
const restoreCart = () => {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) {
    updateCart();
    return;
  }

  try {
    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      throw new Error("El carrito guardado no es válido.");
    }

    cart.splice(0, cart.length);

    parsedCart.forEach((savedProduct) => {
      const currentProduct = products.find(
        (product) => product.id === savedProduct.id,
      );

      const savedQuantity = Number(savedProduct.cantidad);

      if (
        !currentProduct ||
        !Number.isInteger(savedQuantity) ||
        savedQuantity < 1 ||
        currentProduct.stock < 1
      ) {
        return;
      }

      const validQuantity = Math.min(savedQuantity, currentProduct.stock);

      cart.push({
        ...currentProduct,
        cantidad: validQuantity,
      });
    });

    updateCart();
  } catch (error) {
    localStorage.removeItem(CART_STORAGE_KEY);

    cart.splice(0, cart.length);
    updateCart();
  }
};

// Calcula el precio total del carrito.
// Calculates the total cart price.
const calculateCartTotal = () => {
  return cart.reduce(
    (total, product) => total + product.precio * product.cantidad,
    0,
  );
};

// Actualiza la cantidad total mostrada en el carrito.
// Updates the total quantity displayed in the cart.
const updateCartCount = () => {
  const totalQuantity = cart.reduce((total, product) => {
    return total + product.cantidad;
  }, 0);
  cartCount.textContent = totalQuantity;
};

// Actualiza toda la interfaz del carrito.
// Updates the complete cart interface.
const updateCart = () => {
  updateCartCount();
  renderCart();
  saveCart();
};

// Aumenta la cantidad de un producto.
// Increases a product quantity.
const increaseProductQuantity = (productId) => {
  const productInCart = cart.find((product) => product.id === productId);
  if (!productInCart) {
    return;
  }
  if (productInCart.cantidad >= productInCart.stock) {
    showToast(
      `Alcanzaste el stock máximo de ${productInCart.nombre}.`,
      "warning",
    );
    return;
  }
  productInCart.cantidad += 1;
  updateCart();
};

// Disminuye la cantidad de un producto.
// Decreases a product quantity.
const decreaseProductQuantity = (productId) => {
  const productIndex = cart.findIndex((product) => product.id === productId);
  if (productIndex === -1) {
    return;
  }
  if (cart[productIndex].cantidad === 1) {
    cart.splice(productIndex, 1);
  } else {
    cart[productIndex].cantidad -= 1;
  }

  updateCart();
};

// Elimina completamente un producto del carrito.
// Completely removes a product from the cart.
const removeProductFromCart = (productId) => {
  const productIndex = cart.findIndex((product) => product.id === productId);
  if (productIndex === -1) {
    return;
  }
  cart.splice(productIndex, 1);
  updateCart();
};

// Muestra los productos agregados al carrito.
// Renders the products added to the cart.
const renderCart = () => {
  cartItems.textContent = "";

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.classList.add("empty-cart-message");
    emptyMessage.textContent = "Tu carrito está vacío.";

    cartItems.append(emptyMessage);

    cartTotalPrice.textContent = "S/ 0.00";
    checkoutButton.disabled = true;

    return;
  }

  cart.forEach((product) => {
    const cartItem = document.createElement("article");
    const itemName = document.createElement("h3");
    const itemUnitPrice = document.createElement("p");
    const itemSubtotal = document.createElement("strong");

    const itemActions = document.createElement("div");
    const quantityControls = document.createElement("div");

    const decreaseButton = document.createElement("button");
    const quantityValue = document.createElement("span");
    const increaseButton = document.createElement("button");
    const removeButton = document.createElement("button");

    const subtotal = product.precio * product.cantidad;

    cartItem.classList.add("cart-item");
    itemName.classList.add("cart-item-name");
    itemUnitPrice.classList.add("cart-item-price");
    itemSubtotal.classList.add("cart-item-subtotal");

    itemActions.classList.add("cart-item-actions");
    quantityControls.classList.add("quantity-controls");

    decreaseButton.classList.add("quantity-button");
    increaseButton.classList.add("quantity-button");
    quantityValue.classList.add("quantity-value");
    removeButton.classList.add("remove-item-button");

    itemName.textContent = product.nombre;
    itemUnitPrice.textContent = `Precio unitario: S/ ${product.precio.toFixed(2)}`;

    itemSubtotal.textContent = `Subtotal: S/ ${subtotal.toFixed(2)}`;

    decreaseButton.textContent = "-";
    increaseButton.textContent = "+";
    quantityValue.textContent = product.cantidad;
    removeButton.textContent = "Eliminar";
    decreaseButton.type = "button";
    increaseButton.type = "button";
    removeButton.type = "button";

    decreaseButton.setAttribute(
      "arial-label",
      `Disminuir cantidad de ${product.nombre}`,
    );
    increaseButton.setAttribute(
      "arial-label",
      `Aumentar cantidad de ${product.nombre}`,
    );
    removeButton.setAttribute(
      "aria-label",
      `Eliminar ${product.nombre} del carrito`,
    );

    decreaseButton.addEventListener("click", () => {
      decreaseProductQuantity(product.id);
    });

    increaseButton.addEventListener("click", () => {
      increaseProductQuantity(product.id);
    });

    removeButton.addEventListener("click", () => {
      removeProductFromCart(product.id);
    });

    quantityControls.append(decreaseButton, quantityValue, increaseButton);

    itemActions.append(quantityControls, removeButton);

    cartItem.append(itemName, itemUnitPrice, itemSubtotal, itemActions);

    cartItems.append(cartItem);
  });

  const total = calculateCartTotal();

  cartTotalPrice.textContent = `S/ ${total.toFixed(2)}`;
  checkoutButton.disabled = false;
};

// Agrega un producto al carrito.
// Adds a product to the cart.
const addProductToCart = (productId) => {
  const selectedProduct = products.find((product) => product.id === productId);
  if (!selectedProduct) {
    return;
  }

  const productInCart = cart.find((product) => {
    return product.id === productId;
  });

  if (productInCart) {
    if (productInCart.cantidad >= selectedProduct.stock) {
      showToast(
        `No hay más stock disponible de ${selectedProduct.nombre}.`,
        "warning",
      );
      return;
    }
    productInCart.cantidad += 1;
  } else {
    cart.push({
      ...selectedProduct,
      cantidad: 1,
    });
  }
  showToast(`${selectedProduct.nombre} agregado al carrito.`, "success");
  updateCart();
};

// Procesa el clic del botón de producto.
// Handles the product button click.
const handleAddProduct = (event) => {
  const productId = Number(event.currentTarget.dataset.productId);
  addProductToCart(productId);
};

// Normaliza textos para facilitar las búsquedas.
// Normalizes text to make searches easier.
const normalizeText = (value) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Muestra los productos en la página.
// Renders the products on the page.
const renderProducts = (products) => {
  productList.textContent = "";
  if (products.length === 0) {
    const emptyResult = document.createElement("p");

    emptyResult.classList.add("catalog-empty");
    emptyResult.textContent = "No encontramos relojes con esos filtros.";

    productList.append(emptyResult);

    return;
  }
  products.forEach((product, index) => {
    const productCard = document.createElement("article");
    const productImageContainer = document.createElement("div");
    const productImage = document.createElement("img");
    const productCategory = document.createElement("p");
    const productName = document.createElement("h3");

    const productDescription = document.createElement("p");
    const productPrice = document.createElement("p");
    const productStock = document.createElement("p");
    const addButton = document.createElement("button");

    productCard.classList.add("product-card");
    productImageContainer.classList.add("product-image-container");
    productImage.classList.add("product-image");
    productCategory.classList.add("product-category");
    productName.classList.add("product-name");
    productDescription.classList.add("product-description");
    productPrice.classList.add("product-price");
    productStock.classList.add("product-stock");
    addButton.classList.add("add-product-button");

    productImage.src = product.imagen;
    productImage.alt = `Reloj ${product.nombre}`;
    productImage.loading = index === 0 ? "eager" : "lazy";
    productImage.decoding = "async";
    productImage.width = 400;
    productImage.height = 649;
    productImageContainer.append(productImage);

    productCategory.textContent = product.categoria;
    productName.textContent = product.nombre;
    productDescription.textContent = product.descripcion;
    productPrice.textContent = `$/ ${product.precio.toFixed(2)}`;
    productStock.textContent = `Stock disponible: ${product.stock}`;

    addButton.textContent = "Agregar al carrito";
    addButton.type = "button";
    addButton.dataset.productId = product.id;
    addButton.addEventListener("click", handleAddProduct);

    productCard.append(
      productImageContainer,
      productCategory,
      productName,
      productDescription,
      productPrice,
      productStock,
      addButton,
    );

    productList.append(productCard);
  });
};

// Actualiza el mensaje con la cantidad de resultados.
// Updates the message with the number of results.
const updateCatalogResults = (resultsQuantity) => {
  const resultText =
    resultsQuantity === 1 ? "reloj encontrado" : "relojes encontrados";

  catalogResults.textContent = `${resultsQuantity} ${resultText}`;
};

// Filtra los productos por búsqueda y categoría.
// Filters products by search and category.
const applyCatalogFilters = () => {
  const normalizedSearchTerm = normalizeText(searchTerm);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "todos" || product.categoria === selectedCategory;

    const searchableContent = normalizeText(
      `${product.nombre} ${product.descripcion}`,
    );

    const matchesSearch = searchableContent.includes(normalizedSearchTerm);

    return matchesCategory && matchesSearch;
  });

  renderProducts(filteredProducts);
  updateCatalogResults(filteredProducts.length);
};

renderCart();
getProducts();
