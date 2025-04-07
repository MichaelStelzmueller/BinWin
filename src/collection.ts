
// EXPRESS MODUL einbetten & SERVER starten
import express from 'express'
const app = express()


// SERVER konfigurieren
const port = 3000

app.use('/uploads', express.static(__dirname + '/../uploads'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))



// STATIC FILE SERVER starten
// Pfad/dirname bezieht sich auf Ort der JS-Datei!
app.use(express.static(__dirname + '/../public'))


// SERVER starten
app.listen(port, () => {
    console.log('********** Server gestartet **********')
    console.log(`Erreichbar unter https://localhost:${port}`)
})


import ngrok from 'ngrok';
(async function () {
    const url = await ngrok.connect({
        authtoken: '2d20LomqNfl2H7K6N30s8qeAC0u_6THCufjEsFsgvCWQVdK3t',
        addr: port
    });
    console.log('********** ngrok Tunnel offen **********');
    console.log(url);
    console.log('')
})()