var express = require("express");
var router = express.Router();
const Scraper = require("../lib/Scraper");
const ObjectID = require("bson").ObjectID;
const fs = require("fs");

router.get("/", function (req, res, next) {
  res.render("dashboard/scraper/index", {
    layout: "dashboard/layouts/master",
    title: "Scraper",
    active: { scraper: true },
  });
});

router.post("/", async function (req, res, next) {
  console.log(req.body);
  let input = {
    url: req.body.url,
    attribute: req.body.attribute,
    selector: req.body.selector,
    selector_type: req.body.selector_type,
    selector_traversal_type: req.body.selector_traversal_type,
  };
  console.log(input);
  
  try {
    let result = await Scraper.scrape(input);
    let objectId = new ObjectID();

    console.log(result);
    let logger = fs.createWriteStream(__dirname + "/" + objectId + ".owl", {
      flags: "w", // 'a' means appending (old data will be preserved)
    });
    let str = `<?xml version="1.0"?>
<rdf:RDF 
xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
xmlns:rdf="${input.url}">
  
<rdf:Description rdf:about="${result["scraped_page_title"]}"`;

    for (let i = 0; i < input.attribute.length; i++) {
      str += `\n<artikel:${input.attribute[i]}>${
        result[input.attribute[i]]
      }</artikel:${input.attribute[i]}>`;
    }
    logger.write(str); // append string to your file
    logger.end()
    // TODO: Saving data to db for records

    res.send({
      objectId: objectId,
      isError: false,
      stsCode: 200,
      result: str,
      pageTitle: result["scraped_page_title"],
    });
  } catch (error) {
    res.send({
      isError: true,
      stsCode: 500,
      msg: "Someting went wrong, can not scrape the page.",
      errMsg: error.message,
    });
  }
});

router.get("/:objectId/download", async function (req, res, next) {
  let objectId = req.params.objectId;
  // TODO: Building file for download response
  // Get the data from db,
  // Write file
  // Return the file
  // hbs.registerPartials(__dirname + "/views/dashboard/partials");

  const file = __dirname + `/${objectId}.owl`;
  res.download(file);
  // res.send("Downloading..." + objectId);
});

module.exports = router;
