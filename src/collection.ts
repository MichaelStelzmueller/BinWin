// import fsp from 'fs/promises'
// import multer from 'multer'
// import path from 'path'


// const storage = multer.diskStorage({
//     destination: (_req, _file, cb) => {
//         cb(null, __dirname + '/../uploads/');
//     },
//     filename: (_req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });
// const upload = multer ({ storage: storage })

// EXPRESS MODUL einbetten & SERVER starten
import express from 'express'
const app = express()


// SERVER konfigurieren
const port = 3000

// app.use('/uploads', express.static(__dirname + '/../uploads'))
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))


// interface Task {
//     title: string,
//     type: string,
//     price: string,
//     imagePath: string
// }

// let games:Task[]
// async function readGameLibrary() {
//     const data: string = await fsp.readFile(__dirname + '/../data/list.json', 'utf-8');
//     games = JSON.parse(data);
// }

// readGameLibrary()

// app.get('/get-games', (_req, res) => {
//     let answer_json = {
//         'game_list': games
//     }
//     res.send(answer_json)
// })


// app.post('/add-task', upload.single('image'), (req, res) => {

// let regex_title = /^[a-zA-ZäöüÄÖÜß\s]{3,}$/
// let regex_type = /^[a-zA-ZäöüÄÖÜß\s]{3,}$/
// let regex_price = /^(1?\d{1,2}|200)[\s.,]*€$/

// if (regex_title.test(req.body.title) && regex_type.test(req.body.type) && regex_price.test(req.body.price)) {
//     console.log(req.body)
//     let task_title = req.body.title
//     let task_type = req.body.type
//     let task_price = req.body.price


//     let image_filename = req.file ? req.file.filename : '';
//     let image_path = path.join('/uploads', image_filename);
//     console.log(req.file)

//     let task_new:Task = {
//         "title": task_title,
//         "type": task_type,
//         "price": task_price,
//         "imagePath": image_path
//     }

//     games.push(task_new)

//     try {
//         fsp.writeFile(__dirname + '/../data/list.json', JSON.stringify(games, null, 2), 'utf-8')
//         console.log('New task added')
//         let answer_json = {'success': true}
//         res.send(answer_json)
//     } catch (error) {
//         let answer_json = {'success': false}
//         res.send(answer_json)
//     }
// }
// })



// app.post('/remove-task', (req, res) => {
//     let task_id = req.body.task_id;
//     console.log(task_id)

//     games.splice(task_id, 1)

//     try {
//         fsp.writeFile(__dirname + '/../data/list.json', JSON.stringify(games, null, 2), 'utf-8')
//         console.log('Task deleted')
//         let answer_json = {'success': true}
//         res.send(answer_json)
//     } catch (error) {
//         let answer_json = {'success': false}
//         res.send(answer_json)
//     }
// })


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