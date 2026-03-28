const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const db = require("./db");
const path = require("path");

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Session middleware
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true only if using HTTPS
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

// =========================
// AUTH MIDDLEWARE
// =========================
function auth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  next();
}

// =========================
// ROUTES
// =========================

// Open login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// =========================
// LOGIN
// =========================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ success: false, message: "Database error" });
      }

      if (result.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }

      const valid = await bcrypt.compare(password, result[0].password);

      if (!valid) {
        return res.json({ success: false, message: "Invalid password" });
      }

      // Save session
      req.session.userId = result[0].id;
      req.session.userName = result[0].name;
      req.session.userEmail = result[0].email;

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ success: false, message: "Session error" });
        }

        res.json({ success: true, message: "Login successful" });
      });
    }
  );
});

// =========================
// SIGNUP
// =========================
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name, email, hashed],
      (err) => {
        if (err) {
          console.error(err);
          return res.json({ success: false, message: "Signup failed" });
        }

        res.json({ success: true, message: "Signup successful" });
      }
    );
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
});

// =========================
// PROTECTED HOME PAGE
// =========================
app.get("/home", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// =========================
// CHECK AUTH
// =========================
app.get("/check-auth", (req, res) => {
  if (req.session.userId) {
    res.json({
      loggedIn: true,
      userId: req.session.userId,
      name: req.session.userName,
      email: req.session.userEmail
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// =========================
// CURRENT USER
// =========================
app.get("/current-user", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  db.query(
    "SELECT name, email FROM users WHERE id=?",
    [req.session.userId],
    (err, result) => {
      if (err || result.length === 0) {
        console.error(err);
        return res.status(500).json({ error: "User not found" });
      }

      res.json({
        name: result[0].name,
        email: result[0].email
      });
    }
  );
});

// =========================
// Membership
// =========================

app.post("/save-membership", (req, res) => {
  const userId = req.session.userId; // assuming login session
  const { plan, price, duration, benefits, paymentMethod } = req.body;

  if (!userId) {
    return res.json({ success: false, message: "User not logged in" });
  }

  const sql = `
    INSERT INTO memberships (user_id, plan, price, duration, benefits, payment_method)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, plan, price, duration, benefits, paymentMethod], (err, result) => {
    if (err) {
      console.error("Membership save error:", err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});

// =========================
// DEBUG SESSION
// =========================

app.get("/check-session", (req, res) => {
  res.json({
    session: req.session,
    userId: req.session.userId || null,
    name: req.session.userName || null,
    email: req.session.userEmail || null
  });
});

// =========================
// LOGOUT
// =========================
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// =========================
// CHECKOUT
// =========================
app.post("/place-order", (req, res) => {
  const userId = req.session.userId;
  const {
    fullName,
    phone,
    email,
    address,
    city,
    state,
    pincode,
    paymentMethod,
    cart,
    subtotal,
    delivery,
    grandTotal
  } = req.body;

  if (!userId) {
    return res.json({ success: false, message: "Please login first." });
  }

  if (!cart || cart.length === 0) {
    return res.json({ success: false, message: "Cart is empty." });
  }

  const shippingAddress = `${address}, ${city}, ${state}, ${pincode}`;

  const orderSql = `
    INSERT INTO orders (user_id, full_name, phone, email, address, payment_method, subtotal, delivery_charge, total_amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    orderSql,
    [userId, fullName, phone, email, shippingAddress, paymentMethod, subtotal, delivery, grandTotal, "Placed"],
    (err, orderResult) => {
      if (err) {
        console.error("Order insert error:", err);
        return res.json({ success: false, message: "Order save failed." });
      }

      const orderId = orderResult.insertId;

      const orderItems = cart.map(item => [
        orderId,
        item.id,
        item.name,
        item.size,
        item.price,
        item.qty,
        item.price * item.qty,
        item.image
      ]);

      const itemSql = `
        INSERT INTO order_items (order_id, product_id, product_name, size, price, quantity, subtotal, image)
        VALUES ?
      `;

      db.query(itemSql, [orderItems], (itemErr) => {
        if (itemErr) {
          console.error("Order items insert error:", itemErr);
          return res.json({ success: false, message: "Order items save failed." });
        }

        res.json({ success: true });
      });
    }
  );
});

// =========================
// START SERVER
// =========================
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});