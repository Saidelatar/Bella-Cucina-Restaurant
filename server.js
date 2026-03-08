const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// AUTH CREDENTIALS
// ============================================================
const API_KEY = "bella-cucina-api-key-2026";
const BEARER_TOKEN = "bella-cucina-bearer-token-2026";
const BASIC_USER = "bella";
const BASIC_PASS = "cucina123";
const JWT_SECRET = "bella-cucina-jwt-secret-2026";
const OAUTH_CLIENT_ID = "bella-cucina-client";
const OAUTH_CLIENT_SECRET = "bella-cucina-secret-2026";
let oauthTokens = {};

// ============================================================
// MENU DATA
// ============================================================
const menu = {
  restaurant: "Bella Cucina",
  categories: [
    {
      name: "Appetizers",
      name_ar: "المقبلات",
      items: [
        { id: 1, name: "Bruschetta", name_ar: "بروسكيتا", description: "Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil", price: 65, currency: "EGP", is_vegetarian: true, is_gluten_free: false },
        { id: 2, name: "Calamari Fritti", name_ar: "كاليماري مقلي", description: "Crispy fried squid rings served with marinara sauce", price: 95, currency: "EGP", is_vegetarian: false, is_gluten_free: false },
        { id: 3, name: "Caprese Salad", name_ar: "سلطة كابريزي", description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze", price: 80, currency: "EGP", is_vegetarian: true, is_gluten_free: true }
      ]
    },
    {
      name: "Main Courses",
      name_ar: "الأطباق الرئيسية",
      items: [
        { id: 4, name: "Margherita Pizza", name_ar: "بيتزا مارجريتا", description: "Classic pizza with fresh mozzarella, tomato sauce, and basil", price: 120, currency: "EGP", is_vegetarian: true, is_gluten_free: false },
        { id: 5, name: "Pepperoni Pizza", name_ar: "بيتزا بيبروني", description: "Pizza with spicy pepperoni, mozzarella, and tomato sauce", price: 140, currency: "EGP", is_vegetarian: false, is_gluten_free: false },
        { id: 6, name: "Spaghetti Carbonara", name_ar: "سباغيتي كاربونارا", description: "Spaghetti with creamy egg sauce, pancetta, and parmesan", price: 130, currency: "EGP", is_vegetarian: false, is_gluten_free: false },
        { id: 7, name: "Fettuccine Alfredo", name_ar: "فيتوتشيني الفريدو", description: "Fettuccine pasta in creamy parmesan sauce", price: 125, currency: "EGP", is_vegetarian: true, is_gluten_free: false },
        { id: 8, name: "Grilled Salmon", name_ar: "سالمون مشوي", description: "Fresh Atlantic salmon grilled with herbs and lemon butter sauce", price: 220, currency: "EGP", is_vegetarian: false, is_gluten_free: true },
        { id: 9, name: "Chicken Parmigiana", name_ar: "دجاج بارميجيانا", description: "Breaded chicken breast with tomato sauce and melted mozzarella", price: 165, currency: "EGP", is_vegetarian: false, is_gluten_free: false }
      ]
    },
    {
      name: "Desserts",
      name_ar: "الحلويات",
      items: [
        { id: 10, name: "Tiramisu", name_ar: "تيراميسو", description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream", price: 75, currency: "EGP", is_vegetarian: true, is_gluten_free: false },
        { id: 11, name: "Panna Cotta", name_ar: "بانا كوتا", description: "Creamy vanilla panna cotta with mixed berry compote", price: 65, currency: "EGP", is_vegetarian: true, is_gluten_free: true },
        { id: 12, name: "Chocolate Fondant", name_ar: "فوندون شوكولاتة", description: "Warm chocolate cake with a molten center served with vanilla ice cream", price: 85, currency: "EGP", is_vegetarian: true, is_gluten_free: false }
      ]
    },
    {
      name: "Drinks",
      name_ar: "المشروبات",
      items: [
        { id: 13, name: "Fresh Lemonade", name_ar: "ليمونادة طازجة", description: "Freshly squeezed lemonade with mint", price: 35, currency: "EGP", is_vegetarian: true, is_gluten_free: true },
        { id: 14, name: "Mango Smoothie", name_ar: "سموذي مانجو", description: "Blended fresh mango with milk and honey", price: 45, currency: "EGP", is_vegetarian: true, is_gluten_free: true },
        { id: 15, name: "Espresso", name_ar: "اسبريسو", description: "Double shot Italian espresso", price: 30, currency: "EGP", is_vegetarian: true, is_gluten_free: true },
        { id: 16, name: "Cappuccino", name_ar: "كابتشينو", description: "Espresso with steamed milk and foam", price: 45, currency: "EGP", is_vegetarian: true, is_gluten_free: true }
      ]
    }
  ]
};

// ============================================================
// OFFERS DATA
// ============================================================
const offers = {
  total: 3,
  offers: [
    { id: "offer_1", title: "Family Friday", title_ar: "جمعة العيلة", description: "20% off on all main courses every Friday", discount_percent: 20, valid_days: ["Friday"], valid_until: "2026-06-30" },
    { id: "offer_2", title: "Lunch Special", title_ar: "عرض الغداء", description: "Free drink with any main course ordered between 12PM-3PM", discount_percent: 0, valid_days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], valid_until: "2026-04-30" },
    { id: "offer_3", title: "Date Night", title_ar: "ليلة رومانسية", description: "2 main courses + 2 desserts + 2 drinks for 450 EGP instead of 580 EGP", discount_percent: 22, valid_days: ["Saturday"], valid_until: "2026-05-31" }
  ]
};

// ============================================================
// DELIVERY AREAS
// ============================================================
const deliveryAreas = {
  "zamalek": { available: true, area: "Zamalek", delivery_fee: 25, estimated_time: "30-45 minutes", minimum_order: 150 },
  "maadi": { available: true, area: "Maadi", delivery_fee: 35, estimated_time: "40-55 minutes", minimum_order: 150 },
  "dokki": { available: true, area: "Dokki", delivery_fee: 20, estimated_time: "25-35 minutes", minimum_order: 150 },
  "mohandessin": { available: true, area: "Mohandessin", delivery_fee: 20, estimated_time: "25-40 minutes", minimum_order: 150 },
  "heliopolis": { available: true, area: "Heliopolis", delivery_fee: 40, estimated_time: "45-60 minutes", minimum_order: 200 },
  "nasr city": { available: true, area: "Nasr City", delivery_fee: 45, estimated_time: "50-65 minutes", minimum_order: 200 },
  "garden city": { available: true, area: "Garden City", delivery_fee: 15, estimated_time: "20-30 minutes", minimum_order: 100 },
  "downtown": { available: true, area: "Downtown", delivery_fee: 15, estimated_time: "20-30 minutes", minimum_order: 100 },
  "new cairo": { available: false, area: "New Cairo", delivery_fee: 0, estimated_time: "N/A", minimum_order: 0 },
  "6th october": { available: false, area: "6th of October", delivery_fee: 0, estimated_time: "N/A", minimum_order: 0 }
};

// ============================================================
// LOYALTY DATA
// ============================================================
const loyaltyAccounts = {
  "+201012345678": { phone: "+201012345678", customer_name: "Ahmed Mohamed", points: 450, tier: "silver", available_rewards: [
    { reward_id: "free_dessert", name: "Free Dessert", name_ar: "حلو مجاني", points_required: 200 },
    { reward_id: "free_drink", name: "Free Drink", name_ar: "مشروب مجاني", points_required: 100 },
    { reward_id: "15_percent_off", name: "15% Off Next Order", name_ar: "خصم 15% على الطلب القادم", points_required: 500 }
  ]},
  "+201098765432": { phone: "+201098765432", customer_name: "Sara Ali", points: 120, tier: "bronze", available_rewards: [
    { reward_id: "free_drink", name: "Free Drink", name_ar: "مشروب مجاني", points_required: 100 }
  ]},
  "+201155556666": { phone: "+201155556666", customer_name: "Omar Hassan", points: 980, tier: "gold", available_rewards: [
    { reward_id: "free_dessert", name: "Free Dessert", name_ar: "حلو مجاني", points_required: 200 },
    { reward_id: "free_drink", name: "Free Drink", name_ar: "مشروب مجاني", points_required: 100 },
    { reward_id: "15_percent_off", name: "15% Off Next Order", name_ar: "خصم 15% على الطلب القادم", points_required: 500 },
    { reward_id: "free_main", name: "Free Main Course", name_ar: "طبق رئيسي مجاني", points_required: 800 }
  ]}
};

// ============================================================
// ORDERS & RESERVATIONS STORAGE
// ============================================================
let orders = {};
let orderCounter = 1;
let reservations = {};
let resCounter = 1;

// ============================================================
// HELPER: find menu item by id or name
// ============================================================
function findMenuItem(idOrName) {
  for (const cat of menu.categories) {
    const item = cat.items.find(i =>
      i.id === idOrName ||
      i.id === Number(idOrName) ||
      i.name.toLowerCase() === String(idOrName).toLowerCase() ||
      i.name_ar === String(idOrName)
    );
    if (item) return item;
  }
  return null;
}

// ============================================================
// 1. GET /menu — No Auth
// ============================================================
app.get("/menu", (req, res) => {
  res.json(menu);
});

// ============================================================
// 2. GET /offers — No Auth
// ============================================================
// ============================================================
// 2. GET /offers — OAuth 2.0
// ============================================================
app.get("/offers", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing OAuth token" });
  }
  const token = authHeader.split(" ")[1];
  if (!oauthTokens[token]) {
    return res.status(401).json({ error: "Invalid or expired OAuth token" });
  }

  res.json(offers);
});
// ============================================================
// 3. POST /orders — API Key (x-api-key header)
// ============================================================
app.post("/orders", (req, res) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API Key" });
  }

  const { customer_name, phone, items, order_type, address } = req.body;

  if (!customer_name || !phone || !items || !order_type) {
    return res.status(400).json({ error: "Missing required fields: customer_name, phone, items, order_type" });
  }

  if (order_type === "delivery" && !address) {
    return res.status(400).json({ error: "Address is required for delivery orders" });
  }

  let orderItems = [];
  let total = 0;

  for (const item of items) {
    const menuItem = findMenuItem(item.item_id || item.name || item.item_name);
    if (!menuItem) {
      return res.status(400).json({ error: `Menu item '${item.item_id || item.name || item.item_name}' not found` });
    }
    const qty = item.quantity || 1;
    const lineTotal = menuItem.price * qty;
    total += lineTotal;
    orderItems.push({
      item_id: menuItem.id,
      name: menuItem.name,
      name_ar: menuItem.name_ar,
      quantity: qty,
      unit_price: menuItem.price,
      line_total: lineTotal,
      special_instructions: item.special_instructions || null
    });
  }

  const deliveryFee = order_type === "delivery" ? 25 : 0;
  const orderId = `ORD-2026-${String(orderCounter++).padStart(3, "0")}`;

  const order = {
    order_id: orderId,
    customer_name,
    phone,
    order_type,
    address: address || null,
    items: orderItems,
    subtotal: total,
    delivery_fee: deliveryFee,
    grand_total: total + deliveryFee,
    status: "received",
    estimated_delivery: order_type === "delivery" ? "40-50 minutes" : "20-25 minutes",
    created_at: new Date().toISOString(),
    message: "Your order has been received! We'll start preparing it right away."
  };

  orders[orderId] = order;
  res.status(201).json(order);
});

// ============================================================
// 4. GET /orders/:id — Bearer Token
// ============================================================
app.get("/orders/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== `Bearer ${BEARER_TOKEN}`) {
    return res.status(401).json({ error: "Invalid or missing Bearer Token" });
  }

  const order = orders[req.params.id] || orders[req.params.id.toUpperCase()];
  if (!order) {
    return res.status(404).json({ error: `Order ${req.params.id} not found` });
  }
  res.json(order);
});

// ============================================================
// 5. POST /reservations — Basic Auth
// ============================================================
app.post("/reservations", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ error: "Missing Basic Auth header" });
  }
  const base64 = authHeader.split(" ")[1];
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const [user, pass] = decoded.split(":");
  if (user !== BASIC_USER || pass !== BASIC_PASS) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const { customer_name, phone, date, time, guests, special_requests } = req.body;

  if (!customer_name || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: "Missing required fields: customer_name, phone, date, time, guests" });
  }

  if (guests > 12) {
    return res.status(400).json({ error: "Maximum 12 guests per reservation. For larger groups, please call us." });
  }

  const resId = `RES-2026-${String(resCounter++).padStart(3, "0")}`;
  const tableNumber = Math.floor(Math.random() * 20) + 1;

  const reservation = {
    reservation_id: resId,
    customer_name,
    phone,
    date,
    time,
    guests,
    special_requests: special_requests || null,
    status: "confirmed",
    table_number: tableNumber,
    created_at: new Date().toISOString(),
    message: "Your reservation is confirmed! We look forward to seeing you."
  };

  reservations[resId] = reservation;
  res.status(201).json(reservation);
});

// ============================================================
// 6. POST /delivery/check — No Auth
// ============================================================
app.post("/delivery/check", (req, res) => {
  const { area } = req.body;

  if (!area) {
    return res.status(400).json({ error: "Please provide an area name" });
  }

  const areaData = deliveryAreas[area.toLowerCase()];

  if (!areaData) {
    return res.json({
      available: false,
      area: area,
      delivery_fee: 0,
      estimated_time: "N/A",
      minimum_order: 0,
      message: `Sorry, we don't deliver to ${area} yet. Available areas: ${Object.values(deliveryAreas).filter(a => a.available).map(a => a.area).join(", ")}`
    });
  }

  if (!areaData.available) {
    return res.json({
      ...areaData,
      message: `Sorry, we don't deliver to ${areaData.area} yet.`
    });
  }

  res.json({
    ...areaData,
    message: `Great news! We deliver to ${areaData.area}.`
  });
});

// ============================================================
// 7. GET /loyalty/:phone — JWT
// ============================================================
app.get("/loyalty/:phone", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing JWT token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid JWT: " + err.message });
  }

  const phone = req.params.phone;
  const account = loyaltyAccounts[phone];

  if (!account) {
    return res.status(404).json({
      error: `No loyalty account found for ${phone}. Please sign up for our loyalty program!`
    });
  }

  res.json(account);
});
// ============================================================
// OAUTH 2.0 TOKEN ENDPOINT
// ============================================================
app.post("/oauth/token", (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;
  if (grant_type !== "client_credentials") {
    return res.status(400).json({ error: "Only client_credentials grant type is supported" });
  }
  if (client_id !== OAUTH_CLIENT_ID || client_secret !== OAUTH_CLIENT_SECRET) {
    return res.status(401).json({ error: "Invalid client credentials" });
  }
  const token = "oauth-" + Math.random().toString(36).substring(2) + Date.now();
  oauthTokens[token] = { client_id, created_at: Date.now(), expires_in: 3600 };
  res.json({
    access_token: token,
    token_type: "Bearer",
    expires_in: 3600
  });
});
// ============================================================
// JWT TOKEN GENERATOR (for testing)
// ============================================================
app.post("/auth/token", (req, res) => {
  const { username, password } = req.body;
  if (username === BASIC_USER && password === BASIC_PASS) {
    const token = jwt.sign({ username, role: "customer" }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token, expires_in: "1h" });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// ============================================================
// OPENAPI SPEC
// ============================================================
app.get("/openapi.json", (req, res) => {
  const spec = require("./openapi.json");
  res.json(spec);
});

// ============================================================
// ROOT — API Info
// ============================================================
app.get("/", (req, res) => {
  res.json({
    name: "Bella Cucina Restaurant API",
    version: "2.0.0",
    description: "API for Bella Cucina Italian Restaurant",
    auth_credentials: {
      api_key: API_KEY,
      bearer_token: BEARER_TOKEN,
      basic_auth: { username: BASIC_USER, password: BASIC_PASS },
      jwt: "POST /auth/token with username & password to get JWT token"
    },
    endpoints: [
      { method: "GET", path: "/menu", auth: "No Auth", description: "Get full menu" },
      { method: "GET", path: "/offers", auth: "No Auth", description: "Get current offers" },
      { method: "POST", path: "/orders", auth: "API Key (x-api-key header)", description: "Place order" },
      { method: "GET", path: "/orders/:id", auth: "Bearer Token", description: "Track order" },
      { method: "POST", path: "/reservations", auth: "Basic Auth", description: "Make reservation" },
      { method: "POST", path: "/delivery/check", auth: "No Auth", description: "Check delivery" },
      { method: "GET", path: "/loyalty/:phone", auth: "JWT", description: "Check loyalty points" },
      { method: "POST", path: "/auth/token", auth: "No Auth", description: "Get JWT token" }
    ]
  });
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bella Cucina API running on port ${PORT}`);
});