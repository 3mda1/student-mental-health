const API = "http://localhost:3000";

/* ===== DOM ===== */

const username = document.getElementById("username");
const password = document.getElementById("password");

const auth = document.getElementById("auth");
const app = document.getElementById("app");

const total = document.getElementById("total");
const avg = document.getElementById("avg");
const chart = document.getElementById("chart");

const stress = document.getElementById("stress");
const note = document.getElementById("note");

const emojiAnim = document.getElementById("emojiAnim");
const welcome = document.getElementById("welcome");

let mood = "happy";

/* ================= AUTH ================= */

async function register(){
    await fetch(API+"/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            username:username.value,
            password:password.value
        })
    });

    alert("Registered successfully");
}

async function login(){

    let res = await fetch(API+"/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            username:username.value,
            password:password.value
        })
    });

    let data = await res.json();

    if(data.ok){
        localStorage.setItem("user", username.value);

        auth.style.display="none";
        app.style.display="block";

        welcome.innerText = "Welcome " + username.value;

        load();
    } else {
        alert("Invalid login");
    }
}

/* ================= MOOD ================= */

function setMood(m){
    mood = m;

    emojiAnim.innerText =
        m === "happy" ? "😄" :
        m === "ok" ? "😐" : "😢";
}

async function addMood(){

    let user = localStorage.getItem("user");

    await fetch(API+"/moods",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            user,
            mood,
            stress:stress.value,
            note:note.value
        })
    });

    load();
}

/* ================= LOAD DASHBOARD ================= */

async function load(){

    let user = localStorage.getItem("user");

    let stats = await fetch(API+"/stats?user="+user)
    .then(r=>r.json());

    total.innerText = stats.totalDays;
    avg.innerText = stats.averageStress;

    new Chart(chart,{
        type:"doughnut",
        data:{
            labels:Object.keys(stats.moodChart),
            datasets:[{
                data:Object.values(stats.moodChart),
                backgroundColor:[
                    "#38bdf8",
                    "#22c55e",
                    "#f43f5e"
                ]
            }]
        }
    });
}