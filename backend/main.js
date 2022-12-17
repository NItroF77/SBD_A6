const express = require('express');
const cors = require('cors');
const router = require("./routes/routes.js");
const app = express();
app.listen(5000, () =>{
  console.log("server ready at localhost:5000");
});
app.use(router);
app.use(cors());
app.use(express.json());

