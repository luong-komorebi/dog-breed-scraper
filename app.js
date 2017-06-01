var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {

  url = 'https://en.wikipedia.org/wiki/List_of_dog_breeds';
  var obj = { table: [] };
  request(url, function(err, response, html) {
    if (!err) {
      console.log("Fetching dog breed @wikipedia");
      var $ = cheerio.load(html);
      
      var rows = $("tbody").children("tr");
      rows.each(function(i) {
        if (i > 0 && i < 514) {
          var json = { id: "", breed: "", origin: "", akcGroup: "" };
          json.id = i;
          columns = $(this).children("td");
          json.breed = columns.eq(0).children("a").text();
          columns.eq(1).children("a").each(function(k) {
            var origin = $(this).attr("title");
            if (k > 0) {
                json.origin = json.origin + ", " + origin; 
            }
            else json.origin = origin;
          });
          json.akcGroup = columns.eq(3).text();
          obj.table.push(json);
        }
      })
    }

    fs.writeFile('output.json', JSON.stringify(obj, null, 4), function (err) {
      console.log("OUTPUTTING DONE!");
    });

    res.contentType('text/html');
    res.send('DONE!');
  })
})

app.listen(8080);
exports = module.exports = app;

