// myscript.js
// This example uses Node 8's async/await syntax.

const oracledb = require('oracledb');
const express = require('express');
const app = express();
app.set("view engine", "ejs");
app.set("views","views");
let sql,binds,options,result;
let connection;
app.listen(1522,() =>{
    console.log("server ready");
})

app.get("/",(req,res) =>{
    connectDb();
    datas = JSON.parse(JSON.stringify(result["rows"]));
    res.render("index",{datas:datas,title:"OracleDb Simulation"});
})
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


async function connectDb(){
  try {
    connection = await oracledb.getConnection( {
      user          : "tubes",
      password      : "tubes",
      connectString : "localhost/xe"
    });
    sql = `SELECT nama_buku,genre_buku,jenis_buku FROM buku`;

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