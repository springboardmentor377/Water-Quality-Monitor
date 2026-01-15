const API = "http://127.0.0.1:8000";

function register() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    fetch(`${API}/register?username=${u}&password=${p}`, {
        method: "POST"
    })
    .then(r => r.json())
    .then(d => document.getElementById("msg").innerText = d.msg)
    .catch(e => alert("Error"));
}

function login() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    fetch(`${API}/login?username=${u}&password=${p}`, {
        method: "POST"
    })
    .then(r => r.json())
    .then(d => document.getElementById("msg").innerText = d.msg)
    .catch(e => alert("Error"));
}