const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');  // Importe o módulo cors
const moment = require('moment'); 

const app = express();
const port = 3000;
app.use(cors());

app.get('/api/results', async (req, res) => {
    try {
        // Inicialize a variável results como um array vazio
        const results = [];
      // Obter a data atual no formato 'YYYY-MM-DD'
      const currentDate = moment().format('YYYY-MM-DD');

      // Construir a URL com o parâmetro startDate
      const url = `https://www.hltv.org/results?startDate=${currentDate}`;

      // Aguarde 2 segundos antes de fazer a requisição
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Encontrar todas as instâncias da classe "results-sublist"
        $('.big-results .results-sublist .result-con').each((index, element) => {
            // Extrair dados de cada resultado individual
            const team1 = {
                name: $(element).find('.team1 .team').text().trim(),
                logo: $(element).find('.team1 .team-logo').attr('src'),
                result: parseInt($(element).find('.result-score .score-won').text()) || 0
            };

            const team2 = {
                name: $(element).find('.team2 .team').text().trim(),
                logo: $(element).find('.team2 .team-logo').attr('src'),
                result: parseInt($(element).find('.result-score .score-lost').text()) || 0
            };

            const matchData = {
                event: {
                    name: $(element).find('.event-name').text().trim(),
                    logo: $(element).find('.event-logo').attr('src')
                },
                maps: $(element).find('.map').text().trim(),
                time: $(element).find('.time').attr('datetime'),
                teams: [team1, team2],
                matchId: parseInt($(element).find('a').attr('href').split('/').pop())
            };

            results.push(matchData);
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
