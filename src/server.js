import express from 'express'
import configViewEngine from './config/viewEngine'
import initWebRoutes from './routes/web'
import bodyParser from 'body-parser';
import connection from './config/connectDB'
import initApiRoutes from './routes/api'
import configCors from './config/cors'
import cooKieParser from 'cookie-parser'
require("dotenv").config()
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080
//config cors
configCors(app)

//config view engine 
configViewEngine(app);

// test connection db
// connection()

//config cookie-parser
app.use(cooKieParser())

//init web route
initWebRoutes(app);

//init api route
initApiRoutes(app)


app.use((req, res) => {
    return res.send('404 not found')
})

app.listen(PORT, () => {
    console.log(">>>> JWT Backend is running on the port = " + PORT);
})