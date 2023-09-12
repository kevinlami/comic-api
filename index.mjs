import cheerio from 'cheerio';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('build'));

app.use(cors({
  origin: 'https://chapter-updater.netlify.app',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
}));

app.get('/', async (req, res) => {
  res.status(404).send('Comic api');
});

app.get('/verificarPagina', async (req, res) => {
  const url = req.query.url;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(404).send('Página não encontrada.');
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const elementosComClasse = $('.titulo-leitura');
    if (elementosComClasse.length > 0) {
      res.setHeader('Access-Control-Allow-Origin', 'https://chapter-updater.netlify.app');
      res.status(200).send('A classe CSS "titulo-leitura" existe na página.');
    } else {
      res.status(404).send('A classe CSS "titulo-leitura" não foi encontrada na página.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao verificar a página.');
  }
});

app.listen(port, () => {
  console.log(`Servidor proxy em execução na porta ${port}`);
});
