import express, {json} from 'express';
import mysql from 'mysql';
import cors from 'cors';


const app = express();

app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


const db = mysql.createConnection({
    host: 'sql5.freesqldatabase.com',
    user: 'sql5757449',
    password: "lT5KC5K785",
    database: 'sql5757449',
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
    const q =  req.query.id;
    let esameSearchTextQuery = ""
    if(req.query.searchText)
        esameSearchTextQuery = ' and esami.`'+ req.query.searchType  + "` LIKE " + "\'%" + req.query.searchText  + "%\'";
    const sql = 'SELECT distinct `parti corpo`.id , nome FROM `amb_esam` JOIN ambulatori JOIN esami JOIN `parti corpo` WHERE ambulatori.id=amb_esam.id_amb and esami.id=amb_esam.id_esame and esami.body = `parti corpo`.id and ambulatori.id = ' + q + esameSearchTextQuery;
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data);
    })
})

// get exam  by bodypart
app.get('/exams', (req, res) => {
    const q =  req.query.id
    const bd =  req.query.id_bd ? req.query.id_bd : "1";
    let esameSearchTextQuery = ""
    if(req.query.searchText)
        esameSearchTextQuery = ' and esami.`'+ req.query.searchType  + "` LIKE " + "\'%" + req.query.searchText  + "%\'" ;
    const sql = 'SELECT distinct * FROM `amb_esam` JOIN ambulatori JOIN esami JOIN `parti corpo` WHERE ambulatori.id=amb_esam.id_amb and esami.id=amb_esam.id_esame and esami.body = `parti corpo`.id and ambulatori.id =' + q + '  and `parti corpo`.id =' + bd + esameSearchTextQuery;
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data);
    })
})


app.get('/search', (req, res) => {
    const text = req.query.text;
    const typeSearch = req.query.typeSearch;
    const sql = "SELECT distinct * FROM `amb_esam` JOIN ambulatori JOIN esami JOIN `parti corpo` WHERE ambulatori.id=amb_esam.id_amb and esami.id=amb_esam.id_esame and esami.body = `parti corpo`.id and " + "`" + typeSearch +  "`" + " LIKE " + "\'%" + text + "%\' ORDER by esami.id";
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        return res.json(data);
    })
})

app.get('/esami_selezionati', (req, res) => {
    const sql = "SELECT ambulatorio_id, body, `codice Ministeriale`, `codice interno`, data, descrizione, esami_selezionati.id, name FROM `esami_selezionati` JOIN esami JOIN ambulatori WHERE esami_selezionati.id_esame = esami.id and ambulatorio_id = ambulatori.id";
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        return res.json(data);
    })
})


app.post('/insert', (req, res) => {
    const id = req.body.params.id;
    const ambulatorio = req.body.params.ambulatorio;
    const sql = "INSERT INTO `esami_selezionati` (`id_esame`,`ambulatorio_id`) VALUES " + "(\'" + id + "\',\'"+ ambulatorio + "\')";

    db.query(sql, (err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data)
    })
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from esami_selezionati where esami_selezionati.id = " + id;

    db.query(sql,(err, data) => {
        if (err) {
            return res.json({Error: "Error"});
        }
        return res.json(data)
    })
})


app.listen(process.env.PORT || 3040, () => {
    console.log("Server started on port 3000");
})