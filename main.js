const  express = require('express')
const hbs=require('hbs')
const app=express();
const port = 2024;

app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get("/",(req,rest)=> {
    rest.render('index')
})

app.get("/registrar",(req,rest)=> {
    rest.render('registrar')
})

app.get("/editar",(req,rest)=> {
    rest.render('editar')
})

app.listen(port,()=> {
    console.log(`http://localhost:${port}`)
})