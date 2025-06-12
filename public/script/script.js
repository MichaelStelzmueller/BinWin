//***
// Variablen
//***
let counter = 0;
let currClass = null;
let information = "";
gotThePoint = true;
let allPhotos = []; // Speichert alle Fotos
let currentPhotoIndex = -1; // Speichert das aktuelle Bild-Index


//********************************
// Stylesheet-Wechsel
//********************************
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


//********************************
// Login und Registrierung
//********************************

preLog();
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

            // console.log(data);

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

document.addEventListener('keyup', function (event) {
    if (event.key == "Enter") {
        preLog()
    }

})


//********************************
// Seitenwechsel
//********************************
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


//********************************
// Ranking Method(s) ----------------------------------------------------------------
//********************************
function ranking() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);
    replaceStylesheet("style/styleRanking.css");
    document.getElementById("headerGeneral").innerHTML = `<h2>Leaderboard</h2>`;

    fetch('./api/getClass.php')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                let classes = data.array;

                // Sortiere Klassen nach Score absteigend
                classes.sort((a, b) => b.score - a.score);

                // Top 3
                let upperRanksHTML = `
                    <div id="upperRanks">
                        <div id="rank2"><div class="class">${classes[1].name.toUpperCase()}<br><br>${classes[1].score}</div></div>
                        <div id="rank1"><div class="class">${classes[0].name.toUpperCase()}<br><br>${classes[0].score}</div></div>
                        <div id="rank3"><div class="class">${classes[2].name.toUpperCase()}<br><br>${classes[2].score}</div></div>
                    </div>`;

                // Restliche Ränge
                let lowerRanksHHTML = `<div class="lowerHeader">Place &nbsp;&nbsp; Class &nbsp;&nbsp; Points</div>`;
                let lowerRanksHTML = `<div class="lowerRanks">`;
                for (let i = 3; i < classes.length; i++) {
                    lowerRanksHTML += `<div class="rank rank${i+1}">${i+1} · ${classes[i].name.toUpperCase()} · ${classes[i].score}</div>`;
                }
                lowerRanksHTML += `</div>`;

                document.getElementById("content").innerHTML = upperRanksHTML + lowerRanksHHTML + lowerRanksHTML;
            }
        })
        .catch(err => {
            console.error(err);
            alert("Fehler beim Laden der Rangliste");
        });
}


function rankSystem() {
}


//********************************
// Statistic Method(s) ----------------------------------------------------------------
//********************************
function statistics() {
    document.getElementById('body').style.opacity = "0";
    setTimeout(function(){ document.getElementById('body').style.opacity = "1"; }, 100);

    replaceStylesheet("style/styleStatistics.css");
    document.getElementById("headerGeneral").innerHTML = `<h2>Statistics</h2>`;
    document.getElementById("content").innerHTML = `
        <div style="width:90%;max-width:600px;margin:auto;">
            <canvas id="activityDistribution"></canvas>
            <canvas id="activityPerClass" style="margin-top:20px;"></canvas>
            <canvas id="topScores" style="margin-top:20px;"></canvas>
        </div>
    `;

    fetch('./api/getClass.php')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                let classes = data.array;

                let totalPhotos = classes.reduce((sum, c) => sum + (c.photos || 0), 0);
                let totalRatings = classes.reduce((sum, c) => sum + (c.ratings || 0), 0);
                let totalQuizzes = classes.reduce((sum, c) => sum + (c.quizzes || 0), 0);

                // 1️⃣ Pie Chart - Aktivitäten insgesamt
                new Chart(document.getElementById('activityDistribution'), {
                    type: 'pie',
                    data: {
                        labels: ['Fotos hochgeladen', 'Fotos bewertet', 'Quiz gelöst'],
                        datasets: [{
                            data: [totalPhotos, totalRatings, totalQuizzes],
                            backgroundColor: ['#10b310', '#e0ffe0', 'rgb(0, 105, 0)']
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: { display: true, text: 'Aktivitäten insgesamt' }
                        }
                    }
                });

                // 2️⃣ Aktivitäten pro Klasse
                let classLabels = classes.map(c => c.name.toUpperCase());
                let classPhotos = classes.map(c => c.photos || 0);
                let classRatings = classes.map(c => c.ratings || 0);
                let classQuizzes = classes.map(c => c.quizzes || 0);

                new Chart(document.getElementById('activityPerClass'), {
                    type: 'bar',
                    data: {
                        labels: classLabels,
                        datasets: [
                            { label: 'Fotos', data: classPhotos, backgroundColor: '#10b310' },
                            { label: 'Bewertungen', data: classRatings, backgroundColor: '#e0ffe0' },
                            { label: 'Quiz', data: classQuizzes, backgroundColor: 'rgb(0, 105, 0)' }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: { display: true, text: 'Aktivitäten pro Klasse' }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                });

                // 3️⃣ Top 5 Klassen nach Punkten (score)
                let topClasses = classes
                    .map(c => ({ name: c.name.toUpperCase(), score: c.score || 0 }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5);

                new Chart(document.getElementById('topScores'), {
                    type: 'bar',
                    data: {
                        labels: topClasses.map(c => c.name),
                        datasets: [{
                            label: 'Punkte (Score)',
                            data: topClasses.map(c => c.score),
                            backgroundColor: '#ffcc00'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: { display: true, text: 'Top 5 Klassen nach Punkten' }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                });

            } else {
                alert("Fehler beim Laden der Statistikdaten");
            }
        })
        .catch(error => {
            console.error("Error loading statistics:", error);
            alert("Ein Fehler ist aufgetreten.");
        });
}


function statisticSystem() {
}


//********************************
// Points Method(s) ----------------------------------------------------------------
//********************************

//Punkte Startseite
function points() {
    document.getElementById('body').style.opacity = "0";
    setTimeout(function () { document.getElementById('body').style.opacity = "1"; }, 100);

    replaceStylesheet("style/stylePoints.css");
    document.getElementById("headerGeneral").innerHTML = `<img id="logo" src="./Logo_BinWin.png">`;

    // Erst mal statisches Layout einbauen, Score später dynamisch setzen
    document.getElementById("content").innerHTML = `
        <div id="stylingBoxForPoints">
            <div><img id="pointIconP" src="./icons/recycle.png"></div>
            <div><p id="numberOfPoints">x...</p></div> <!-- Platzhalter -->
            <div id="getPointsButton" onclick="goToButtons()">Get Points</div>
        </div>`;

    // Jetzt Punkte laden
    fetch('./api/getUser.php')
        .then(response => response.json())
        .then(userData => {
            if (userData.code === 200) {
                const userClass = userData.array[0].class;

                fetch('./api/getClass.php')
                    .then(response => response.json())
                    .then(classData => {
                        if (classData.code === 200) {
                            const classInfo = classData.array.find(c => c.name === userClass);
                            const score = classInfo ? classInfo.score : 0;

                            document.getElementById("numberOfPoints").innerText = "x" + score;
                        }
                    });
            }
        });
}


function rewardSystem(activityType) {
    fetch('./api/getUser.php')
        .then(response => response.json())
        .then(userData => {
            if (userData.code === 200) {
                let classUser = userData.array[0].class;

                fetch('./api/getClass.php')
                    .then(response => response.json())
                    .then(classData => {
                        if (classData.code === 200) {
                            for (let i = 0; i < classData.array.length; i++) {
                                if (classUser === classData.array[i].name) {
                                    classData.array[i].score += 1;

                                    if (activityType === "photo") classData.array[i].photos += 1;
                                    if (activityType === "rating") classData.array[i].ratings += 1;
                                    if (activityType === "quiz") classData.array[i].quizzes += 1;
                                }
                            }

                            // Update an Server schicken
                            fetch('./api/updateClass.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(classData)
                            })
                            .then(response => response.json())
                            .then(result => {
                                if (result.success) {
                                    profile();
                                    alert("1 point added to class " + classUser);
                                } else {
                                    alert("Fehler beim Speichern: " + result.error);
                                }
                            });
                        }
                    });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Fehler beim Punkte-System");
        });
}

//Button anzeige für die Punkte
function goToButtons() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/stylePointButtons.css")
    document.getElementById("content").innerHTML = `<div id="stylingBoxForButtons">
    <div id="button1" onclick="goToPhoto()">Take a Photo</div>
    <div id="button2" onclick="goToQuiz()">Take a Quiz</div>
    <div id="button3" onclick="goToRatePhoto()">Rate Photos</div>    
    <div id="button4" onclick="goToExplanation()"><img src="./icons/whiteInfo.svg"></div>
    </div>`
}

//Quiz
let quizCounter = 0;

function goToQuiz() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/styleQuiz.css")
    document.getElementById("content").innerHTML = `<div id="quizBox"></div>`
    getQuestions();
}
function getQuestions() {

    if (quizCounter >= 2) {
    rewardSystem('quiz');
    }   


    fetch("./api/quizapi.php")
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                console.log("Quiz Loaded Successfully:");
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
        quizCounter++;
        setTimeout(function(){ getQuestions() }, 2000);

    } else {
        button.classList.add("wrong");
        quizCounter = 0;
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


//Bewertung von Fotos
function goToRatePhoto() {
    document.getElementById('body').style.opacity = "0";
    setTimeout(() => { document.getElementById('body').style.opacity = "1"; }, 100);

    replaceStylesheet("style/styleRatePhotos.css");

    fetch(`./api/getClass.php`)
        .then(response => response.json())
        .then((data) => {
            // console.log(data.array);

            if (data.code == 200 && data.array.length > 0) {
                allPhotos = data.array;
                showRandomPhoto();
            } else {
                document.getElementById("content").innerHTML = `<p>No images available.</p>`;
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred, please try again later!");
        });
}
function showRandomPhoto() {
    if (allPhotos.length === 0) return;

    // Wähle zufälligen Index, aber stelle sicher, dass es nicht das gleiche Bild wie vorher ist
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * allPhotos.length);
    } while (randomIndex === currentPhotoIndex);

    currentPhotoIndex = randomIndex;
    const photo = allPhotos[currentPhotoIndex];

    document.getElementById("content").innerHTML = `
        <div id="photoBox">
            <div class="photo">
                <img src="${photo.source}" alt="photo">
                <div onclick="activateRatePhotoGetPointsButton()" class="rating" data-photo-id="${photo.id}">
                    ${generateStars(photo.id)}
                </div>
                <button class="ratePhotoGetPointsInactive">Get points</button>
            </div>
        </div>
    `;

    setupStarRating(); // Event-Listener für Sterne hinzufügen
}

function activateRatePhotoGetPointsButton() {
    let button = document.querySelector(".ratePhotoGetPointsInactive");
    if (button) {
        button.classList = ""; // Leert die Klassenliste
        button.classList.add("ratePhotoGetPoints"); // Fügt die gewünschte Klasse hinzu
        button.onclick = function() { rewardSystem('rating') };

    }
}

function generateStars(photoId) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="star" data-rating="${i}" data-photo-id="${photoId}">&#9733;</span>`;
    }
    return starsHTML;
}
function setupStarRating() {
    const stars = document.querySelectorAll(".star");

    stars.forEach(star => {
        star.addEventListener("click", function() {
            const rating = this.getAttribute("data-rating");
            const photoId = this.getAttribute("data-photo-id");
            highlightStars(photoId, rating);
        });
    });
}
function highlightStars(photoId, rating) {
    const stars = document.querySelectorAll(`.rating[data-photo-id="${photoId}"] .star`);

    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute("data-rating"));
        if (starRating <= rating) {
            star.classList.add("selected");
        } else {
            star.classList.remove("selected");
        }
    });
}

//Foto machen
function goToPhoto() {
    document.getElementById('body').style.opacity = "0"
    setTimeout(function(){ document.getElementById('body').style.opacity = "1" }, 100);

    replaceStylesheet("style/styleCamera.css")
    document.getElementById("content").innerHTML = `<video id="video" autoplay></video>
    <button id="captureBtn">Take Picture</button>
    <canvas id="canvas"></canvas>
    <button id="saveBtn" onclick="rewardSystem('photo')" style="display: none;">Get points</button>`
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
        // link.download = "image.png";
        // link.click();
    });
}

function savePhoto() {
    const canvas = document.getElementById('canvas');

    // Schritt 1: Klasse des aktuellen Users holen
    fetch('./api/getUser.php')
        .then(response => response.json())
        .then(userData => {
            if (userData.code === 200) {
                const className = userData.array[0].class;
                

                // Schritt 2: Canvas zu PNG-Blob konvertieren
                canvas.toBlob(function(blob) {
                    const formData = new FormData();
                    const filename = 'image_' + Date.now() + '.png';

                    formData.append('image', blob, filename);
                    formData.append('className', className); // ← wie in saveImage.php erwartet
                
                    // Schritt 3: Upload starten
                    fetch('./api/saveImage.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log("Bild erfolgreich gespeichert für Klasse:", className);

                            const resultBox = document.getElementById('uploadResult');
                            if (resultBox) {
                                resultBox.innerHTML = `
                                    <p>Bild erfolgreich gespeichert:</p>
                                    <img src="${data.url}" width="200">
                                `;
                            }
                        } else {
                            alert("Fehler beim Speichern: " + data.error);
                        }
                    })
                    .catch(err => {
                        console.error("Fehler beim Upload:", err);
                        alert("Upload fehlgeschlagen.");
                    });

                }, 'image/png');

            } else {
                alert("Benutzerdaten konnten nicht geladen werden.");
            }
        })
        .catch(err => {
            console.error("Fehler beim Laden der Benutzerdaten:", err);
            alert("Ein Fehler ist aufgetreten, bitte später erneut versuchen.");
        });
}


// Erklärung
function goToExplanation() {
    replaceStylesheet("style/styleFAQ.css")

    document.getElementById("content").innerHTML = `
        <div class="faq-container">
            <div id="header"><h1>How do I get Points?</h1></div>

            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    <p>What is BinWin?</p>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    <p>
                        BinWin is a fun, easy-to-use project designed to encourage students to dispose of waste properly 
                        and keep our school clean and organized. 
                        It’s all about making small, everyday actions count – and rewarding you for doing the right thing!
                        <br><br>
                        Instead of just throwing your trash in the bin, 
                        BinWin gives you a way to track your eco-friendly actions. 
                        Whether it’s taking a picture of your waste, rating other students’ actions, 
                        or answering short quizzes about recycling, you get points every time you engage with the app.
                        <br><br>    
                        But it’s not just about points – 
                        it’s about creating a cleaner, greener school, 
                        showing respect for the environment, 
                        and making the school a better place for everyone.
                    </p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    <p>Why BinWin?</p>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    <p>
                        Because your class is in the race.
                        <br><br>
                        Because the top scorers will stand out.
                        <br><br>
                        Because you’ve got the skills to lead by example.
                        <br><br>
                        It’s about mindset. Tech meets responsibility. And yeah – some bragging rights too.
                        <br><br>
                        This isn’t just about trash.
                        <br><br>
                        It’s about doing smart things, making a difference, and having some fun while you’re at it.
                    </p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    <p>Why BinWin is a Game-Changer</p>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    <p>
                    It’s Easy, Fun, and Rewarding!
                    <br><br>
                    No need for complicated rules. 
                    Just take a pic, rate others, and answer quizzes. 
                    Simple, right? And the best part is, you get rewarded for doing your part. 
                    It’s a win-win situation!
                    <br><br>
                    It’s All About Teamwork
                    <br><br>
                    By using BinWin, you’re not only helping yourself – 
                    you’re contributing to a cleaner, more organized school. 
                    Everyone is in it together, working toward a common goal. 
                    The more you participate, the more you help your school, the environment, and yourself.
                    <br><br>
                    It’s a Step Toward a Greener Future
                    <br><br>
                    Every small action you take has a bigger impact. 
                    By practicing waste separation at school, you’ll be more likely to carry that habit into your daily life. 
                    Together, we can make the world a cleaner place, starting right here.
                    </p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    <p>Take a Photo</p>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    <p>
                        Before you throw anything away, take a quick photo. 
                        This action alone earns you 1 point! 
                        It’s a small effort that makes a big difference in keeping track of your waste.
                    </p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    <p>Take a Quiz</p>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    <p>
                        Once you’ve uploaded your photo, it’s time to rate others’ photos. 
                        This encourages everyone to engage with each other and gives you 1 point each time you rate a photo. 
                        It’s a simple way to help the community and learn more about how others handle waste.
                    </p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    <p>Rate Photos</p>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    <p>
                        You can also earn points by answering a few quick questions in a fun quiz. 
                        Just 3 correct answers = 1 point. 
                        It’s an easy way to boost your score while learning more about environmental issues, recycling, and sustainability.
                    </p>
                </div>
            </div>
        </div>
    `;
}

function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const symbol = element.querySelector("span");
    answer.classList.toggle("show");
    symbol.textContent = answer.classList.contains("show") ? "−" : "+";
}

//********************************
// Rewards Method(s) ----------------------------------------------------------------
//********************************
function rewards() {
    document.getElementById('body').style.opacity = "0";
    setTimeout(function () { document.getElementById('body').style.opacity = "1"; }, 100);
    replaceStylesheet("style/styleRewards.css");

    document.getElementById("headerGeneral").innerHTML = `<h2 class="milestones-title">Achievements 🌟</h2>`;
    document.getElementById("content").innerHTML = `<div class="milestones-container" id="milestoneContainer"></div>`;

    // Hole User Klasse
    fetch('./api/getUser.php')
        .then(response => response.json())
        .then(userData => {
            if (userData.code === 200) {
                const userClass = userData.array[0].class;

                // Hole Klassendaten
                fetch('./api/getClass.php')
                    .then(response => response.json())
                    .then(classData => {
                        if (classData.code === 200) {
                            const classInfo = classData.array.find(c => c.name === userClass);

                            // Alle Werte holen
                            const score = classInfo.score || 0;
                            const photos = classInfo.photos || 0;
                            const ratings = classInfo.ratings || 0;
                            const quizzes = classInfo.quizzes || 0;

                            let html = "";

                            // Punkte Achievements
                            html += renderMilestone(score >= 1, "#FFC107", "1", "🏅 Rookie Recycler");
                            html += renderMilestone(score >= 10, "#FF5722", "10", "🦸 Eco Hero");
                            html += renderMilestone(score >= 25, "#4CAF50", "25", "🌎 Planet Protector");

                            // Foto Achievements
                            html += renderMilestone(photos >= 1, "#9C27B0", "📸", "First Shot");
                            html += renderMilestone(photos >= 10, "#3F51B5", "📷", "Paparazzi (10 Pictures)");

                            // Bewertung Achievements
                            html += renderMilestone(ratings >= 1, "#00BCD4", "⭐️", "First Judge");
                            html += renderMilestone(ratings >= 20, "#009688", "🌟", "Top Reviewer (20 Reviews)");

                            // Quiz Achievements
                            html += renderMilestone(quizzes >= 1, "#FF9800", "🧠", "First Quiz");
                            html += renderMilestone(quizzes >= 10, "#8BC34A", "🎓", "Quizmaster (10 perfect Quizzes)");

                            document.getElementById("milestoneContainer").innerHTML = html;
                        }
                    });
            }
        });

    function renderMilestone(unlocked, color, badge, title) {
        const stateClass = unlocked ? "unlocked" : "locked";
        return `
            <div class="milestone ${stateClass}">
                <div class="milestone-badge" style="background-color:${color};">${badge}</div>
                <span>${title}</span>
            </div>
        `;
    }
}




//********************************
// Profile Method(s) ----------------------------------------------------------------
//********************************
function profile() {
    document.getElementById('body').style.opacity = "0";
    setTimeout(function () { document.getElementById('body').style.opacity = "1"; }, 100);

    replaceStylesheet("style/styleProfil.css");

    fetch('./api/getUser.php')
        .then(response => response.json())
        .then(userData => {
            if (userData.code === 200) {
                const userClass = userData.array[0].class;
                const userName = userData.array[0].name;

                fetch('./api/getClass.php')
                    .then(response => response.json())
                    .then(classData => {
                        if (classData.code === 200) {
                            const classes = classData.array;
                            const classInfo = classes.find(c => c.name === userClass);
                            const score = classInfo.score || 0;
                            const photos = classInfo.photos || 0;
                            const ratings = classInfo.ratings || 0;
                            const quizzes = classInfo.quizzes || 0;

                            const sorted = [...classes].sort((a, b) => b.score - a.score);
                            const rank = sorted.findIndex(c => c.name === userClass) + 1;

                            let achievements = 0;
                            if (score >= 1) achievements++;
                            if (score >= 10) achievements++;
                            if (score >= 25) achievements++;
                            if (photos >= 1) achievements++;
                            if (photos >= 10) achievements++;
                            if (ratings >= 1) achievements++;
                            if (ratings >= 20) achievements++;
                            if (quizzes >= 1) achievements++;
                            if (quizzes >= 10) achievements++;

                            // XP & Levelsystem
                            const xp = score + (photos * 3) + (ratings * 2) + (quizzes * 2);
                            const levelThresholds = [0, 20, 50, 100, 200, 400, 700, 1000, 1500, 2100, 3000];

                            function calculateLevel(xp) {
                                for (let i = levelThresholds.length - 1; i >= 0; i--) {
                                    if (xp >= levelThresholds[i]) {
                                        let nextXp = (i+1 < levelThresholds.length) ? levelThresholds[i+1] : levelThresholds[i];
                                        let progress = Math.min(100, ((xp - levelThresholds[i]) / (nextXp - levelThresholds[i])) * 100);
                                        return { level: i+1, xp: xp, nextXp: nextXp, progress: progress.toFixed(1) };
                                    }
                                }
                                return { level: 1, xp: xp, nextXp: levelThresholds[1], progress: 0 };
                            }

                            const levelData = calculateLevel(xp);

                            // HTML Rendering
                            document.getElementById("headerGeneral").innerHTML = `<h2>Profile</h2>`;
                            document.getElementById("content").innerHTML = `
                                <div id="profilBox">
                                    <div id="profilIcon">
                                        <img src="./icons/profile.svg">
                                    </div>
                                    <div id="profiltxt">
                                        <div class="profiltxtC"><strong>Name: </strong>${userName}</div>
                                        <div class="profiltxtC"><strong>Class: </strong>${userClass}</div>
                                    </div>
                                </div>
                                <hr>
                                <div id="overview">
                                    <div class="overviewBox">
                                        <div><img onclick="changeSideTo('ranking')" class="iconsProfil" src="./icons/ranking.svg"></div>
                                        <div>(#${rank})</div>
                                    </div>
                                    <div class="overviewBox">
                                        <div><img onclick="changeSideTo('points')" id="pointIconP" class="icons" src="./icons/recycle.svg"></div>
                                        <div>(x${score})</div>
                                    </div>
                                    <div class="overviewBox">
                                        <div><img onclick="changeSideTo('rewards')" class="iconsProfil" src="./icons/trophy.svg"></div>
                                        <div>(${achievements})</div>
                                    </div>
                                </div>
                                <hr>
                                <div id="activityBox">
                                    <div class="activityStat">📸 Photos: <strong>${photos}</strong></div>
                                    <div class="activityStat">⭐ Ratings: <strong>${ratings}</strong></div>
                                    <div class="activityStat">🧠 Quizzes: <strong>${quizzes}</strong></div>
                                </div>
                                <hr>
                                <div id="levelBox">
                                    <div class="levelHeader">Level ${levelData.level}</div>
                                    <div class="xpText">${levelData.xp} / ${levelData.nextXp} XP</div>
                                    <div class="progressBarOuter">
                                        <div class="progressBarInner" style="width:${levelData.progress}%"></div>
                                    </div>
                                </div>
                            `;
                        }
                    });
            }
        });
}


function rankSystem() {
}
function statisticSystem() {
}

function profileSystem() {
}

