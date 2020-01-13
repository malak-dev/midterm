


const request = require("request");

const wordToSearch = 'lovely'

const options = {
  method: 'GET',
  url: `https://wordsapiv1.p.rapidapi.com/words/${wordToSearch}/synonyms`,
  headers: {
    'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
    'x-rapidapi-key': '4bc5297189mshad05789f52986cdp15bdd0jsnc1cab87f8526'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

  console.log(body);
  const data = JSON.parse(body)
  console.log(data)
  console.log(data.synonyms)
});

