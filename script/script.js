function register() {
    document.getElementById("body").innerHTML = `
    <div id="forLogin-container">
        <h1>Benutzerliste</h1>
        <ul id="userList"></ul>

        <h2>Neuen Benutzer hinzufügen</h2>
        <input type="text" id="name" placeholder="Name">
        <input type="password" id="password" placeholder="Passwort">
        <input type="text" id="department" placeholder="Abteilung">
        <input type="text" id="class" placeholder="Klasse">
        <button id="addUserButton" onclick="addUser()">Register</button>
    </div>`;
}

function printUser() {
    fetch(`../api/userapi.php`)
        .then((response) => response.json())
        .then((data) =>{
            console.log(data);
            if(data.code == 200) {
                //html
            } else {
                //error message
            }
           
        })
        .catch((error)=>{
            console.log(error);
        })
}


function addUser() {
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const department = document.getElementById("department").value;
    const classValue = document.getElementById("class").value;

    if (name && password && department && classValue) {
        fetch('../api/userapi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password, department, class: classValue }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                alert("User registered successfully!");
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    } else {
        alert("Please fill in all fields!");
    }
}



//variablen 
gotThePoint = true;

// validLogIn()
//valid-Login
function validLogIn(){
    document.body.style = `background:white;`
    document.body.innerHTML = `
    <div id="headerGeneral">
        <img id="logo" src="./Logo_BinWin.png"> 
    </div>

    <div id="content"></div>

    <footer>
        <img onclick="changeSideTo('ranking')" class="icons" src="./icons/ranking.svg">
        <img onclick="changeSideTo('statistic')" class="icons" src="./icons/statistic.svg">
        <p onclick="changeSideTo('points')" class="icons">♻️</p>
        <img onclick="changeSideTo('rewards')" class="icons" src="./icons/trophy.svg">
        <img onclick="changeSideTo('profile')" class="icons" src="./icons/profile.svg">
    </footer>`
}

//Navigation
function changeSideTo(side) {
    switch (side) {
        case 'ranking':
            ranking();
            break;
        case 'statistic':
            statistics();
            break;
        case 'points':
            points();
            break;
        case 'rewards':
            rewards();
            break;
            case 'profile':
            profile();
            break;    
        default:
            break;
    }
}

function ranking() {
}
function statistics() {
}
function points() {
    document.getElementById("content").innerHTML = `<div id="stylingBoxForPoints">
    <p id="pointIcon">♻️</p><p id="numberOfPoints">x10</p>
    <div id="getPointsButton" onclick="goToPhoto()">Get Points</div></div>`
}
function goToPhoto() {
    if (gotThePoint) {
        alert("Already got the Point for Today")
    }else{}
}

function rewards() {
}
function profile() {
}
function rankSystem() {
}
function statisticSystem() {
}
function pointsystem() {
}
function rewardSystem() {
}
function profileSystem() {
}