const express = require("express")
const app = express()
const mysql = require("mysql")
const moment = require("moment")
const PORT = process.env.PORT || 3000

const logger = (req, res, next) => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss')

    console.log(
        `${req.protocol}://${req.get("host")}${req.originalUrl} : ${moment().format()}`
    )
    next();
}

app.use(logger);

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee"
});

connection.connect()

app.listen(1234, ()=>{
    console.log(`Server is running at PORT: ${PORT}`)
})

// REPORT - CRUD
app.get("/api/members", (req, res) => {
    connection.query("SELECT * FROM userdata" ,(err, rows, fields) => {
        if(err) throw err;
        res.json(rows)
    })
})

// REPORT - CRUD - SEARCH
app.get("/api/members/:id", (req, res) => {
    const id = req.params.id
    // res.send(id)
    connection.query(`SELECT * FROM userdata WHERE id = ${id}`, (err, rows, fields)=>{
        if(err) throw err;
        if(rows.length > 0){
            res.json(rows)
        }else{
            res.status(400).json({msg:`${id} id not found`})
        }
    })
})

//POST
//CREATE - CRUD

app.use(express.urlencoded({extended: false}))
app.post("/api/members", (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const gender = req.body.gender;
    connection.query(`INSERT INTO userdata (first_name, last_name, email, gender) VALUES ('${fname}', '${lname}', '${email}', '${gender}')`, (err, rows, fields) => {
            if(err) throw err;
            res.json({msg:`Successfully Inserted`})
    })
})

//PUT
//UPDATE - CRUD

// app.use(express.urlencoded({extended: false}))
// app.post("/api/members", (req, res) => {
//     const fname = req.body.fname;
//     const lname = req.body.lname;
//     const email = req.body.email;
//     const gender = req.body.gender;
//     const id = req.body.id;
//     connection.query(`UPDATE userdata SET first_name='${fname}', last_name='${lname}', email='${email}', gender='${gender}' WHERE id='${id}'`, (err, rows, fields) => {
//         if(err) throw err;
//         res.json({msg:`Successfully Updated`})
//     })
// })

//DELETE

app.use(express.urlencoded({extended: false}))
app.delete("/api/members", (req, res) => {
    const id = req.body.id;
    connection.query(`DELETE FROM userdata WHERE id='${id}'`, (err,rows,fields) => {
        if(err) throw err;
        res.json({msg:`Successfully Deleted`})
    
    })

})

app.listen(3000, () =>{
    console.log(`Server is running at port ${PORT}`)
})