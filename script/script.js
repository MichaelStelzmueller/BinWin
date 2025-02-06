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

function replaceStylesheet(newHref) {
    // Alle Stylesheets entfernen
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => link.remove());

    // Neues Stylesheet hinzufügen
    addStylesheet(newHref);
    addStylesheet('style/style.css');
}

function addStylesheet(href) {
    let newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = href;
    document.head.appendChild(newLink);
}


function ranking() {
    replaceStylesheet("style/styleRanking.css");
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
    document.getElementById("content").innerHTML = `
  <h2 class="milestones-title">Milestones</h2>
  <div class="milestones-container">
    <div class="milestone">
      <div class="milestone-badge">1</div>
      <span>First R-Point</span>
    </div>
    <div class="milestone">
      <div class="milestone-badge">5</div>
      <span>x5 R-Points</span>
    </div>
    <div class="milestone">
      <div class="milestone-badge">10</div>
      <span>x10 R-Points</span>
    </div>
    <div class="milestone locked">
      <div class="milestone-badge">50</div>
      <span>x50 R-Points</span>
    </div>
    <!-- Weitere Milestones -->
    <div class="milestone">
      <div class="milestone-badge">100</div>
      <span>x100 R-Points</span>
    </div>
    <div class="milestone locked">
      <div class="milestone-badge">200</div>
      <span>x200 R-Points</span>
    </div>
    <div class="milestone locked">
      <div class="milestone-badge">500</div>
      <span>x500 R-Points</span>
    </div>
  </div>
`
}
function profile() {
    replaceStylesheet("style/styleProfil.css");
    fetch(`./api/allData.php`)
        .then((response) => response.json())
        .then((data) => {

            console.log(data);

            if (data.code == 200) {
                document.getElementById("content").innerHTML = `
                <div id="profilBox">
                    <div id="profilIcon">
                    <img src="./icons/profile.svg">
                    </div>
                    <div id="profiltxt">
                        <div id="profil-txt-n" class="profiltxtC">${data.array[0].name}</div>
                        <div id="profil-txt-c" class="profiltxtC">${data.array[0].class}</div>
                    </div>
                </div>`
            }

            else {
                console.log("Etwas ist schief gelaufen");

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