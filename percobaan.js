// myscript.js
// This example uses Node 8's async/await syntax.

const oracledb = require('oracledb');
const express = require('express');
const app = express();
app.set("view engine", "ejs");
app.set("views","views");
let sql,binds,options,result;
let connection;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
connectDb();

async function connectDb(){
  try {
    connection = await oracledb.getConnection( {
      user          : "TUBES",
      password      : "TUBES",
      connectString : "localhost/xe"
    });
    sql = `SELECT nama_buku,genre_buku,jenis_buku from buku`;

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await getRow(`"p-buku"`);
    console.log(result);
  } catch (err) {
    console.error(err);}
    console.log(result);
  }


  async function getRow(table) {
    console.log(table);
    let sql = `select count(*) as total from ${table}`;
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      autoCommit: true,
      resultSet: true
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };
    try {
      let temp = await connection.execute(sql);
      return JSON.parse(JSON.stringify(temp))["rows"][0].TOTAL.toString();
    }
    catch (err) {
      console.log(err);
    }
  }