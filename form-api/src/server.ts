import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import FormsRouter from './controllers/forms.js'
import usersRouter from './controllers/users.js'
import cookieParser from 'cookie-parser'
import { sendError } from './util/errorHandler.js'
import SubmissionsRouter from './controllers/submissions.js'


//GC App Engine env variable
const port = parseInt(process.env.backendPort!);
const app = express()

app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json({ limit: "20mb" }));

app.use(cors({
    "allowedHeaders": [
        'Origin', 'X-Requested-With',
        'Content-Type', 'Accept',
        'X-Access-Token', 'Authorization', 'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials'
    ],
    "methods": 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    'origin': 'http://localhost:3000',
    preflightContinue: false,
    "credentials": true //necessary for cookies
}));


app.get('/', (req, res) => {
    res.send('Server Up and Running');
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});


app.use(cookieParser())
app.use('/', FormsRouter)
app.use('/', usersRouter)

app.use('/', SubmissionsRouter)
app.use(sendError)

export { app }