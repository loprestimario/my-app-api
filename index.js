import express, {json} from 'express';
import mysql from 'mysql';
import cors from 'cors';




const app = express();
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


const db1 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'test',
})

const db = mysql.createConnection({
    host: 'sql5.freesqldatabase.com',
    user: 'sql5757449',
    password: "lT5KC5K785",
    database: 'sql5757449',
})

app.get('/', (req, res) => {
    console.log("reeeeeeeee" ,req.query.id)
    const q =  req.query.id
    const sql = 'SELECT * FROM ambulatori where id = ' + q;
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data);
    })
})

// all ambulatori
app.get('/ambulatori', (req, res) => {
    const sql = 'SELECT * FROM ambulatori ';
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data);
    })
})

// get body part by ambulatorio id
app.get('/body', (req, res) => {
    console.log("reeeeeeeee" ,req.query.id)
    const q =  req.query.id
    // const sql = 'SELECT * FROM `amb_esam` JOIN ambulatori JOIN esami WHERE ambulatori.id=amb_esam.id_amb and esami.id=amb_esam.id_esame and ambulatori.id = ' + q;
    const sql = 'SELECT distinct `parti corpo`.id , nome FROM `amb_esam` JOIN ambulatori JOIN esami JOIN `parti corpo` WHERE ambulatori.id=amb_esam.id_amb and esami.id=amb_esam.id_esame and esami.body = `parti corpo`.id and ambulatori.id =' + q;
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data);
    })
})

// get exam  by bodypart
app.get('/exams', (req, res) => {
    console.log("get exam  by bodypart id" ,req.query.id)
    const q =  req.query.id
    const bd =  req.query.id_bd ? req.query.id_bd : "1";
    console.log("get exam  by bodypart bd" ,req.query.id_bd)

    // const sql = 'SELECT * FROM `amb_esam` JOIN ambulatori JOIN esami WHERE ambulatori.id=amb_esam.id_amb and esami.id=amb_esam.id_esame and ambulatori.id = ' + q;
    const sql = 'SELECT distinct * FROM `amb_esam` JOIN ambulatori JOIN esami JOIN `parti corpo` WHERE ambulatori.id=amb_esam.id_amb and esami.id=amb_esam.id_esame and esami.body = `parti corpo`.id and ambulatori.id =' + q + '  and `parti corpo`.id =' + bd;
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        console.log("data exams ", data)
        return res.json(data);
    })
})


app.get('/search', (req, res) => {
    const codiceMin = req.query.id;
    const typeSearch = req.query.typeSearch;
    console.log("typeSearch  ", typeSearch)
    const sql = "SELECT distinct * FROM `amb_esam` JOIN ambulatori JOIN esami JOIN `parti corpo` WHERE ambulatori.id=amb_esam.id_amb and esami.id=amb_esam.id_esame and esami.body = `parti corpo`.id and " + "`" + typeSearch +  "`" + " LIKE " + "\'%" + codiceMin + "%\'";
    console.log(sql)
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        return res.json(data);
    })
})

app.get('/esami_selezionati', (req, res) => {
    const codiceMin = req.query.id;
    const typeSearch = req.query.typeSearch;
    console.log("typeSearch  ", typeSearch)
    const sql = "SELECT * FROM `esami_selezionati` JOIN esami JOIN ambulatori WHERE esami_selezionati.id_esame = esami.id and ambulatorio = ambulatori.id";
    console.log(sql)
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        return res.json(data);
    })
})


app.post('/create', (req, res) => {
    const sql = 'INSERT INTO prova (nome, cognome, stato) VALUES (?)';
    const values = [
        req.body.nome,
        req.body.cognome,
        req.body.stato
    ]

    db.query(sql, [values],(err, result) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data)
    })
})

app.delete('/delete/:id', (req, res) => {

    const id = req.params.id;
    console.log("id     ddddddddddd   ", id)

    const sql = "delete from esami_selezionati where esami_selezionati.id_esame = " + id;

    console.log(sql);

    db.query(sql, [id],(err, result) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data)
    })
})

app.post('/update/:id', (req, res) => {
    const sql = 'UPDATE prova set nome="444"';
    const values = [
        req.body.nome,
        req.body.cognome,
        req.body.stato
    ]

    db.sql(sql, [values],(err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data)
    })
})

app.listen(process.env.PORT | 3040, () => {
    console.log("Server started on port 3000");
})