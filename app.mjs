import express from 'express';
import nunjucks from 'nunjucks';
import { dirname } from 'path';
import routes from './routes/index.mjs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(
    import.meta.url));

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(express.static(__dirname + '/public'));
app.use('/', routes);

export default app;