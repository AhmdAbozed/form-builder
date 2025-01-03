import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import FormsRouter from './controllers/forms.js'
import usersRouter from './controllers/users.js'
import cookieParser from 'cookie-parser'
import { sendError } from './util/errorHandler.js'
import SubmissionsRouter from './controllers/submissions.js'
import path from 'path'
import { fileURLToPath } from 'url';
//main().catch(console.error);

//GC App Engine env variable
const port = parseInt(process.env.backendPort!);
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    preflightContinue: true,
    "credentials": true //necessary for cookies
}));



app.use(cookieParser())
app.use('/', FormsRouter)
app.use('/', usersRouter)

app.use('/', SubmissionsRouter)
app.use(express.static(path.join(__dirname, 'out')));

app.get('/fill/*', (req, res) => {
    // Serve the same index.html for all /fill/* paths, a workaround for nextjs dynamic route CSR with export
    res.sendFile(path.join(__dirname, 'out/fill/[...id]', 'index.html'));
  });
  
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

app.use(sendError)

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

export { app }