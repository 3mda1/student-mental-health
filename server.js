const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= FILES ================= */

const USERS_FILE = "./Data/users.json";
const MOODS_FILE = "./Data/moods.json";

/* ================= HELPERS ================= */

function read(file){
    try {
        return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
        return [];
    }
}

function write(file, data){
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ================= ROOT ================= */

app.get("/", (req, res) => {
    res.send("MoodFlow API (JSON Mode) 🚀");
});

/* ================= REGISTER ================= */

app.post("/register", (req, res) => {
    let users = read(USERS_FILE);

    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ error: "Missing data" });
    }

    if (users.find(u => u.username === username)) {
        return res.json({ error: "User exists" });
    }

    users.push({ username, password });
    write(USERS_FILE, users);

    res.json({ ok: true });
});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {
    let users = read(USERS_FILE);

    const { username, password } = req.body;

    let user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ error: "Invalid credentials" });
    }

    res.json({ ok: true, user: username });
});

/* ================= MOODS ================= */

app.post("/moods", (req, res) => {
    let moods = read(MOODS_FILE);

    const { user, mood, stress, note } = req.body;

    moods.push({
        id: Date.now(),
        user,
        mood,
        stress: Number(stress),
        note,
        time: new Date().toLocaleDateString()
    });

    write(MOODS_FILE, moods);

    res.json({ ok: true });
});

/* ================= STATS ================= */

app.get("/stats", (req, res) => {
    let moods = read(MOODS_FILE);

    let user = req.query.user;

    let userMoods = moods.filter(m => m.user === user);

    let total = userMoods.length;
    let sum = 0;
    let count = { happy: 0, ok: 0, sad: 0 };

    userMoods.forEach(m => {
        sum += m.stress;
        count[m.mood]++;
    });

    res.json({
        totalDays: total,
        averageStress: total ? (sum / total).toFixed(1) : 0,
        moodChart: count
    });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});