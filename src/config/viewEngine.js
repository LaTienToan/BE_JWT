import express from 'express'

// app la app express
const configViewEngine = (app) => {
    app.use(express.static('./src/public'));
    app.set("view engine", "ejs"); // t dung cai view engine co ten la ejs
    app.set("views", "./src/views");// all file view se luu o src/views 
}

export default configViewEngine