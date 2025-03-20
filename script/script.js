let counter = 0;
let currClass = null;
let information = "";

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
        <img onclick="changeSideTo('points')" class="icons" src="./icons/recycle.svg">
        <img onclick="changeSideTo('rewards')" class="icons" src="./icons/trophy.svg">
        <img onclick="changeSideTo('profile')" class="icons" src="./icons/profile.svg">
    </footer>`

    changeSideTo('profile');
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
    let timestamp = new Date().getTime(); // Zeitstempel generieren
    let newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = href + `?${timestamp}`; // Cache verhindern durch Query-Parameter
    document.head.appendChild(newLink);
}


function ranking() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/styleRanking.css");
    document.getElementById("headerGeneral").innerHTML = `<h2>Leaderboard</h2>`	

    document.getElementById("content").innerHTML =
    `<div id="upperRanks">
        <div id="rank2">
            <div class="class">2BHITM<br><br>200</div>
        </div>
        <div id="rank1">
            <div class="class">1BHITM<br><br>300</div>
        </div>
        <div id="rank3">
            <div class="class">3BHITM<br><br>150</div>
        </div>
    </div>
    <div class="lowerRanks">
        <div class="rank rank4">4 · test · 100</div>
        <div class="rank rank5">5 · test · 100</div>
        <div class="rank rank6">6 · test · 100</div>
        <div class="rank rank7">7 · test · 100</div>
        <div class="rank rank8">8 · test · 100</div>
        <div class="rank rank9">9 · test · 100</div>
        <div class="rank rank10">10 · test · 100</div>
        <div class="rank rank11">11 · test · 100</div>
        <div class="rank rank12">12 · test · 100</div>
        <div class="rank rank13">13 · test · 100</div>
    </div>
    `;
}
function statistics() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    document.getElementById("headerGeneral").innerHTML = `<h2>Statistics</h2>`	
}
function points() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/stylePoints.css")
    document.getElementById("headerGeneral").innerHTML = `<img id="logo" src="./Logo_BinWin.png">`
    document.getElementById("content").innerHTML = `<div id="stylingBoxForPoints">
    <div><img id="pointIconP" src="./icons/recycle.png"></div>
    <div><p id="numberOfPoints">x10</p></div>
    <div id="getPointsButton" onclick="goToButtons()">Get Points</div></div>`
}

function goToButtons() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/stylePointButtons.css")
    document.getElementById("content").innerHTML = `<div id="stylingBoxForButtons">
    <div id="button1" onclick="goToPhoto()">Take a Photo</div>
    <div id="button2" onclick="goToQuiz()">Take a Quiz</div>
    <div id="button3" onclick="goToRatePhoto()">Rate Photos</div>    
    <div id="button4" onlick="goToExplanation()"><img src="./icons/info.svg"></div>
    </div>`
}

function goToQuiz() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/styleQuiz.css")
    document.getElementById("content").innerHTML = `<div id="quizBox"></div>`
    getQuestions();
}

function getQuestions() {
    fetch("./api/quizapi.php")
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            console.log("Quiz Loaded Successfully:", data.array);
            displayRandomQuestion(data.array);
        } else {
            console.error("Error loading quiz:", data.code);
        }
    })
    .catch(error => console.error("Fetch error:", error));

    function displayRandomQuestion(questions) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const q = questions[randomIndex];
    
        let questionHTML = `
                <h3>${q.question}</h3>
                <div class="options">
        `;
    
        q.options.forEach(option => {
            questionHTML += `<button class="quiz-option" onclick="checkAnswer(this, '${option}', '${q.answer}')">${option}</button>`;
        });
    
        questionHTML += `
            </div>
        `;
    
        document.getElementById("quizBox").innerHTML = questionHTML;
    }
    
}
function checkAnswer(button, selected, correct) {
    const buttons = document.querySelectorAll(".quiz-option");

    if (selected === correct) {
        button.classList.add("correct");
        setTimeout(function(){ getQuestions() }, 2000);

    } else {
        button.classList.add("wrong");
        buttons.forEach(btn => {
            if (btn.innerText === correct) {
                btn.classList.add("correct");
            }
        });
        setTimeout(function(){ goToButtons() }, 2000);
    }

    // Deaktiviere alle Buttons nach der Auswahl
    buttons.forEach(btn => btn.disabled = true);
}

function goToRatePhoto() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/styleRatePhotos.css");
    fetch(`./api/getClass.php`)
        .then((response) => response.json())
        .then((data) => {

            console.log(data.array);

            if (data.code == 200) {
                document.getElementById("content").innerHTML = '<div id="photoBox">'
                for (let index = 0; index < data.array.length; index++) {
                    document.getElementById("content").innerHTML += `
                    <div class="photo">
                        <img src="${data.array[index].image}" alt="photo">
                        <div class="rating">
                            <button onclick="ratePhoto('good', ${data.array[index].id})">Good</button>
                            <button onclick="ratePhoto('bad', ${data.array[index].id})">Bad</button>
                        </div>
                `   
                }

                
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

function goToPhoto() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/styleCamera.css")
    document.getElementById("content").innerHTML = `<video id="video" autoplay></video>
    <button id="captureBtn">Take Picture</button>
    <canvas id="canvas"></canvas>
    <button id="saveBtn" onclick="rewardSystem()" style="display: none;">Get points</button>`
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const captureBtn = document.getElementById("captureBtn");
    const saveBtn = document.getElementById("saveBtn");

    // Start Camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Error accessing camera:", err);
        });

    // Capture Image
    captureBtn.addEventListener("click", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Canvas sichtbar machen
        canvas.style.display = "block";
        
        // Save-Button anzeigen
        saveBtn.style.display = "block";
    });
    

    // Save Image
    saveBtn.addEventListener("click", () => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        currClass = savePhoto();
        link.download = "image.png";
        link.click();
    });
}


function savePhoto() {    
    fetch(`./api/getUser.php`)
        .then((response) => response.json())
        .then((data) => {

            console.log(data);

            if (data.code == 200) {
                return data.array[0].class;
            }

            else {
                console.log("Etwas ist schief gelaufen");

            }

        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred please try again later!");
            return null;
        });
}

function goToExplanation() {
    information = `
    <div>
        <div><h1>Wie bekommst du Punkte?</h1></div>
    </div>
    `;
}


function rewards() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/styleRewards.css");
    document.getElementById("headerGeneral").innerHTML = `<h2 class="milestones-title">Milestones</h2>`
    document.getElementById("content").innerHTML = `
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
    <div class="milestone">
      <div class="milestone-badge">25</div>
      <span>x25 R-Points</span>
    </div>
    <div class="milestone locked">
      <div class="milestone-badge">50</div>
      <span>x50 R-Points</span>
    </div>
    <div class="milestone locked">
      <div class="milestone-badge">75</div>
      <span>x75 R-Points</span>
    </div>
    <div class="milestone locked">
      <div class="milestone-badge">100</div>
      <span>x100 R-Points</span>
    </div>
    <div class="milestone locked">
      <div class="milestone-badge">110</div>
      <span>x120 R-Points</span>
    </div>
    <div class="milestone locked">
      <div class="milestone-badge">120</div>
      <span>x120 R-Points</span>
    </div>
  </div>
`
}
function profile() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/styleProfil.css");
    fetch(`./api/getUser.php`)
        .then((response) => response.json())
        .then((data) => {

            console.log(data);

            if (data.code == 200) {
                document.getElementById("headerGeneral").innerHTML = `<h2>Profil</h2>`	
                document.getElementById("content").innerHTML = `

                <div id="profilBox">
                    <div id="profilIcon">
                    <img src="./icons/profile.svg">
                    </div>
                    <div id="profiltxt">
                        <div id="profil-txt-n" class="profiltxtC"><strong>Name: </strong>${data.array[0].name}</div>
                        <div id="profil-txt-c" class="profiltxtC"><strong>Klasse: </strong>${data.array[0].class}</div>
                    </div>
                </div>
                <hr>
                <div id="overview">
                        <div class="overviewBox">
                            <div><img onclick="changeSideTo('ranking')" class="iconsProfil" src="./icons/ranking.svg"></div>
                            <div>(#1)</div>
                        </div>
                        <div class="overviewBox">
                            <div><img onclick="changeSideTo('points')" class="icons" src="./icons/recycle.svg"></div>
                            <div>(x10)</div>
                        </div>
                        <div class="overviewBox">
                            <div><img onclick="changeSideTo('rewards')" class="iconsProfil" src="./icons/trophy.svg"></div>
                            <div>(x3)</div>
                        </div>
                    </div>
                `
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
    fetch('./api/getUser.php')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {                
                let classUser = data.array[0].class;
                console.log(classUser);

                fetch('./api/getClass.php')
                    .then(response => response.json())
                    .then(data => {
                        if (data.code === 200) {                
                            console.log(data);
                            
                            for (let i = 0; i < data.array.length; i++) {
                                if (classUser == data.array[i].name) {
                                    data.array[i].score += 1;
                                }
                            }

                        } else {
                            console.log("Fehler beim Abrufen der Klassendaten");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching user data:", error);
                        alert("Ein Fehler ist aufgetreten, bitte später erneut versuchen!");
                });

            } else {
                console.log("Fehler beim Abrufen der Benutzerdaten");
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Ein Fehler ist aufgetreten, bitte später erneut versuchen!");
    });
}

function profileSystem() {
}


document.addEventListener('keyup', function (event) {
    console.log(event.key)
    if (event.key == "Enter") {
        preLog()
    }

})