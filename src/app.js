const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//DEFINE PATHS FOR EXPRESS CONFIG:
//Uses "path" node module and express shortcut "__dirname" to find public directory:
const publicDirectoryPath = path.join(__dirname, "../public");
//Create custom "views" path inside new "templates" folder:
const viewsPath = path.join(__dirname, "../templates/views");
// after adding a new "partials" directory (to hold "partials" (aka page templates)) to "web-server" directory define the path for it here:
const partialsPath = path.join(__dirname, "../templates/partials");
//Just to see:
// console.log(publicDirectoryPath);

//Set up handlebars engine to create dynamic templates:
app.set("view engine", "hbs");
//Set custom path to "views" directory:
app.set("views", viewsPath);
//Set custom path to "partials" directory
hbs.registerPartials(partialsPath);

// //Sets "views" path configuration so app will always use the correct "views" folder, even if you run it from "src" >>> will run from root without this line! but if you "nodemon app.js" from "src" it will fail to find "views" (b/c it defaults to looking inside root only, not inside children of root??? double check this reason).
// //THIS IS NOT NEEDED b/c a custom "views" path is declared above (const "viewsPath") (~line 10)
// app.set("views", path.join(__dirname, "../views"));

//Setup static directory to serve (public)
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Matt Jones",
    message: "Find current weather conditions:",
  });
});

//ROUTES:

//app.com (Root route)
// app.get("", (req, res) => {
//   res.send("hello express");
// });

//app.com/help
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Matt Jones",
    message: "A helpful thing.",
  });
});

//app.com/about
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Matt Jones",
    message: "",
  });
});

//app.com/weather
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide a search term.",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          location,
          forecast: forecastData,
          address: req.query.address,
        });
      });
    }
  );
});

//app.com/products
app.get("/products", (req, res) => {
  if (!req.query.search) {
    //Must RETURN below otherwise both res.send instances run, causing an error for sending headers twice:
    return res.send({
      error: "You must provide a search term.",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

//app.com/help/* 404
//"*" IS WILDCARD. Help article not found
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Matt Jones",
    message: "Help article not found.",
  });
});

//app.com/* 404
//"*" IS WILDCARD. THIS ROUTE HANDLER MUST COME LAST.
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Matt Jones",
    message: "Page Not Found",
  });
});

//Starts express server
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
