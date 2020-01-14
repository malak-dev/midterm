

const request = require("request");


const requestApi = function(value,cb) {
//const value = 'purchase'
const wordToSearch = value

const options = {
  method: 'GET',
  url: `https://wordsapiv1.p.rapidapi.com/words/${wordToSearch}/synonyms`,
  headers: {
 //   'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
 //  'x-rapidapi-key': '4bc5297189mshad05789f52986cdp15bdd0jsnc1cab87f8526'
  }
};

request(options, function (error, response, body) {

  if (error) throw new Error(error);

  const data = JSON.parse(body)
  console.log(data.synonyms)


   let table = 0;
    for (let word of data.synonyms) {


    if (word === "watch") {
      table = 1
      break
    }
    if (word === "read") {
      table = 2
      break
    }
    if (word === "eat") {
      table = 3
      break
    }
    if (word === "buy") {
      table = 4
      break
    }


   }

   cb(table)
});


 }
//requestApi('purchase',(table) => console.log(table))

module.exports = requestApi


