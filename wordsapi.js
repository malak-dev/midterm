

const request = require("request");


const requestApi = function (value, cb) {
  //const value = 'purchase'
  const wordToSearch = value
  //GET https://wordsapiv1.p.mashape.com/words/{word}

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

    if (data.message === "word not found") {
      table = 6
      cb(table)
    }

    else {
      for (let word of data.synonyms) {
        if (word === "watch") {
          table = 1
          return cb(table)
        } if (word === "read") {
          table = 2
          return cb(table)
        } if (word === "eat") {
          table = 4
          return cb(table)
        } if (word === "buy") {
          table = 3
          return cb(table)
        }
        else {
          table = 5
        }

      }
      return cb(table)
    }

  });

}

// function for testing the value
const sortItem = function (value) {
  let table = 0;
  if (value === "watch") {
    table = 1
  }
  else if (value === "read") {
    table = 2;
  }
  else if (value === "eat") {
    table = 4;
  }
  else if (value === "buy") {
    table = 3;
  }
  else if (value === "") { table = 5; }
  return table;
}

module.exports = { requestApi, sortItem }


