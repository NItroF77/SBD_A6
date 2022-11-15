// myscript.js
// This example uses Node 8's async/await syntax.

const oracledb = require('oracledb');
const express = require('express');
const dbConfig = require('./dbconfig.js');
const app = express();
let status = false;
app.set("view engine", "ejs");
app.set("views","views");
let sql,binds,options,result;
let connection;
app.listen(1522,() =>{
    console.log("server ready");
});

app.get("/",(req,res) =>{
    if(!status){
        res.status(301).redirect("/login")
    }
    connectDb();
    
});
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


async function connectDb(){
  try {
    connection = await oracledb.getConnection(dbConfig);
    sql = `SELECT * FROM no_example`;

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);
    console.log(result);
  } catch (err) {
    console.error(err);}
  }