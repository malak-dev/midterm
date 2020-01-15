

const request = require("request");


const requestApi = function(value,cb) {
//const value = 'purchase'
const wordToSearch = value

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
  //console.log(error)

  const data = JSON.parse(body)
  console.log(data.message)
  console.log(data.synonyms)

   let table = 0;

    if (data.message = "word not found") {
      table = 5
    }
    else {
    for (let word of data.synonyms) {
      if (word === "watch") {
      table = 1
      } if (word === "read") {
      table = 2
      } if (word === "eat") {
      table = 3
      } if (word === "buy") {
      table = 4
      }
      else { table = 5
      }
   }
  }

   cb(table)
});


 }
//requestApi('purchase',(table) => console.log(table))

module.exports = requestApi


