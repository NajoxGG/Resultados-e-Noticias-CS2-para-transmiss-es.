const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const moment = require('moment');

const app = express();
const port = 3001;
app.use(cors());

app.get('/api/noticias', async (req, res) => {
    try {
        // Inicialize a variável results como um array vazio
        const results = [];

        // Construir a URL com o parâmetro startDate
        const url = `https://draft5.gg/`;

        // Aguarde 2 segundos antes de fazer a requisição
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Encontrar todas as instâncias da classe "Card__CardContainer-sc-122kzjp-0"
        $('.Card__CardContainer-sc-122kzjp-0').each((index, element) => {
            // Verificar se a classe "NewsCard__Title-sc-3os0ad-0" tem um valor
            const titulo = $(element).find('.NewsCard__Title-sc-3os0ad-0').text().trim();
            if (titulo) {
                // Extrair dados de cada resultado individual
                const newsData = {
                    titulo: titulo,
                    pais: $(element).find('.NewsCard__CategoryFlag-sc-3os0ad-5').attr('src')
                };

                // Adicione os dados ao array results
                results.push(newsData);
            }
        });

        res.json(results);
    } catch (error) {
        console.error('Erro ao acessar a página:', error.message);
        res.status(500).json({ error: 'Erro ao acessar a página' });
    }
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
