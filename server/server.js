// Load environment variables from .env file
// Path ini relatif terhadap lokasi server.js (yaitu C:\Users\sanz\Desktop\finally-editing\server\)
// '../../.env' akan naik dua tingkat ke C:\Users\sanz\Desktop\finally-editing\.env
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

// --- START DEBUGGING .env VALUES ---
console.log("--- DEBUGGING .env VALUES ---");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log(
  "DB_PASSWORD:",
  process.env.DB_PASSWORD
    ? "******** (Length: " + process.env.DB_PASSWORD.length + ")"
    : "UNDEFINED"
);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "UNDEFINED");
console.log("DESTINATION_EMAIL:", process.env.DESTINATION_EMAIL);
console.log("-----------------------------");
// --- END DEBUGGING .env VALUES ---

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Serve static files from the 'public' directory
// __dirname adalah 'C:\Users\sanz\Desktop\finally-editing\server'
// '../public' akan naik satu tingkat ke 'C:\Users\sanz\Desktop\finally-editing\' lalu masuk ke 'public\'
const staticPath = path.join(__dirname, "../public");
console.log(`Mengakses statis dari: ${staticPath}`);
app.use(express.static(staticPath));

// MySQL Database Connection Pool
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // --- OBJEK 'SSL' SEKARANG DI SINI, TETAPI MASIH DIKOMENTARI UNTUK DEBUGGING EMAIL ---
  // Setelah email berfungsi, Anda bisa mengaktifkan ini kembali.
  // Pastikan ca.pem berada di C:\Users\sanz\Desktop\finally-editing\
  // Path ini relatif terhadap lokasi server.js
  // '../../ca.pem' akan naik dua tingkat ke C:\Users\sanz\Desktop\finally-editing\ca.pem
  // ssl: {
  //   ca: fs.readFileSync(path.join(__dirname, '../../ca.pem')),
  //   minVersion: 'TLSv1.2',
  //   rejectUnauthorized: false
  // }
};

let pool;

async function connectToDatabase() {
  try {
    console.log("Mencoba membuat pool koneksi MySQL dengan konfigurasi:");
    console.log("  Host:", dbConfig.host);
    console.log("  Port:", dbConfig.port);
    console.log("  User:", dbConfig.user);
    console.log("  Database:", dbConfig.database);

    pool = mysql.createPool(dbConfig);
    // Try to get a connection to verify
    await pool.query("SELECT 1");
    console.log("Koneksi ke database MySQL berhasil dibuat dan diuji!");
  } catch (error) {
    console.error("Gagal terhubung ke database MySQL:", error.message);
    if (error.code) {
      console.error("Kode Error:", error.code);
    }
    if (error.sqlMessage) {
      console.error("Pesan SQL Error:", error.sqlMessage);
    }
    process.exit(1);
  }
}

// Call the function to connect to the database
connectToDatabase();

// Nodemailer Transporter for Email Notification
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Pastikan ini adalah App Password jika 2FA aktif
  },
});

// --- ROUTE FOR COMMENTS ---
app.post("/api/comments", async (req, res) => {
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({
      success: false,
      message: "Nama dan komentar tidak boleh kosong.",
    });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO comments (name, comment_text) VALUES (?, ?)",
      [name, text]
    );
    console.log("Komentar disimpan ke database:", result.insertId);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.DESTINATION_EMAIL,
      subject: `[Komentar Baru] dari ${name}`,
      html: `
        <p>Anda menerima komentar baru:</p>
        <ul>
          <li><strong>Nama:</strong> ${name}</li>
          <li><strong>Komentar:</strong> ${text}</li>
        </ul>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Gagal mengirim notifikasi email komentar:", error);
      } else {
        console.log("Notifikasi email komentar terkirim:", info.response);
      }
    });

    res.status(201).json({
      success: true,
      message: "Komentar berhasil dikirim dan disimpan!",
      comment: {
        id: result.insertId,
        name,
        comment_text: text,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error saat menyimpan komentar atau mengirim email:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat menyimpan komentar.",
    });
  }
});

// --- ROUTE TO GET COMMENTS ---
app.get("/api/comments", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT name, comment_text, timestamp FROM comments ORDER BY timestamp DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error saat mengambil komentar:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil komentar." });
  }
});

// --- ROUTE FOR CONTACT ---
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Nama, email, dan pesan tidak boleh kosong.",
    });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.DESTINATION_EMAIL,
      subject: `[Pesan Kontak Baru] dari ${name} (${email})`,
      html: `
        <p>Anda menerima pesan kontak baru:</p>
        <ul>
          <li><strong>Nama:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Pesan:</strong> ${message}</li>
        </ul>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Gagal mengirim pesan kontak:", error);
        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat mengirim pesan kontak.",
        });
      } else {
        console.log("Pesan kontak terkirim:", info.response);
        res
          .status(200)
          .json({ success: true, message: "Pesan kontak berhasil dikirim!" });
      }
    });
  } catch (error) {
    console.error("Error saat mengirim pesan kontak:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat mengirim pesan kontak.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
