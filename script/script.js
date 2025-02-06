let counter = 0;

preLog()

function preLog() {
    const username = document.getElementById("usernameForLogin").value;
    const pw = document.getElementById("pwForLogin").value;
    LogIn(username, pw);
}


function register() {
    document.getElementById("body").innerHTML = `
    <div id="form-container">
        <h1>Benutzerliste</h1>

        <h2>Neuen Benutzer hinzufügen</h2>
        <input type="text" id="name" placeholder="Name">
        <input type="password" id="password" placeholder="Passwort">
        
        <select id="department">
            <option>Medientechnik</option>
            <option>Informatik</option>
            <option>Elektronik</option>
            <option>Medizintechnik</option>
        </select>

        <input type="text" id="class" placeholder="Klasse">
        
        <button id="addUserButton" onclick="addUser()">Registrieren</button>

        <footer>
            <p>Already have an account? <a href="./index.html">Click here</a></p>
        </footer>
    </div>`;
}

function LogIn(uname, pass) {

    let formData = new FormData();
    formData.append('user', uname);
    formData.append('password', pass);

    let fetch_url = './api/userapi.php';
    let fetch_config = {
        method: "POST",
        body: formData,
        headers: {
            "Accept": "aplication/json"
        }
    }

    fetch(fetch_url, fetch_config) 
        .then((response) => response.json())
        .then((data) => {

            console.log(data);

            if (data.code == 200) {
                    validLogIn();
                } 
                
            else {
                if (counter > 0) {
                    alert(data.msg);
                }
                counter++
                
            }

        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred please try again later!");
        });
}



function addUser() {
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const department = document.getElementById("department").value;
    const classValue = document.getElementById("class").value;

    if (name && password && department && classValue) {
        fetch('./api/userapi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password, department, class: classValue }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Server response:", data);
            if (data.code === 200) {
                alert("User registered successfully!");
                LogIn(name, password)
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));

        
        
    } else {
        alert("Please fill in all fields!");
    }
}


//variablen 
gotThePoint = true;

function validLogIn() {
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

function addStylesheet(href) {
    let newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = href;
    document.head.appendChild(newLink);
}

function ranking() {
    addStylesheet("styleRanking.css");
    document.getElementById("content").innerHTML =
    `<div id="rankSystem">
        <div id="rank2">
            <div class="class">1BHITM</div>
            <div class="box"></div>
        </div>
        <div id="rank1">
            <div class="class">2BHITM</div>
            <div class="box"></div>
        </div>
        <div id="rank3">
            <div class="class">3BHITM</div>
            <div class="box"></div>
        </div>
    </div>`;
}
function statistics() {
}
function points() {
    document.getElementById("content").innerHTML = `<div id="stylingBoxForPoints">
    <p id="pointIcon">♻️</p><p id="numberOfPoints">x10</p>
    <div id="getPointsButton" onclick="goToPhoto()">Get Points</div></div>`
}


function rewards() {
}
function profile() {
    let formData = new FormData();
    formData.append('user', uname);
    formData.append('class', uclass);

    let fetch_url = './api/userapi.php';
    let fetch_config = {
        method: "POST",
        body: formData,
        headers: {
            "Accept": "aplication/json"
        }
    }

    fetch(fetch_url, fetch_config)
        .then((response) => response.json())
        .then((data) => {

            console.log(data);

            if (data.code == 200) {
                document.getElementById("content").innerHTML = `
                <div>
                    <div id="profilIcon">
                    <img src="./icons/profile.svg">
                    </div>
                    <div>
                        <div>${uname}</div>
                        <div>${uclass}</div>
                    </div>
                </div>`
            }

            else {
                if (counter > 0) {
                    alert(data.msg);
                }
                counter++

            }

        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred please try again later!");
        });

    
}

function rankSystem() {
}
function statisticSystem() {
}

function rewardSystem() {
}
function profileSystem() {
}


document.addEventListener('keyup', function (event) {
    console.log(event.key)
    if (event.key == "Enter") {
        preLog()
    }

})