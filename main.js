// myscript.js
// This example uses Node 8's async/await syntax.

const oracledb = require('oracledb');
const express = require('express');
const app = express();
let status_login = false;
let bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}
));
app.set("view engine", "ejs");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
app.set("views", "views");
let result = [{
      NAMA_BUKU: '',
      GENRE_BUKU: '',
      JENIS_BUKU: ''
}];
let connection;
app.listen(1522, () => {
  console.log("server ready");
});
app.get("/", (req, res) => {
  let data_status;
  if (status_login) {
    data_status = renderData();
    let datas = JSON.parse(JSON.stringify(result));
    console.log(datas);
      if(data_status){
        res.render("index", { datas: datas, title: "OracleDb Simulation" });
        return true;
       }
       else{
        res.render("index", {title: "Error" });
        return false;
       }
  }
  else {
    res.render("login/login");
  }
});

app.get("/add_buku", (req, res) => {
  res.render("add_buku", { title: "Penambahan Buku" });
});
app.post("/login-user", (req, res) => {
  if (connectDb(req.body.username, req.body.password)) {
    status_login = true;
    res.redirect("/");
  }
});
app.post("/post_buku", (req, res) => {
    sql = `insert into buku(nama_buku,genre_buku,jenis_buku) values(:1,:2,:3)`;
    binding = [req.body.nama_buku,req.body.genre_buku,req.body.jenis_buku];
    post_status = getData(sql,binding);
    console.log(post_status);
    res.redirect("/");
});

async function connectDb(username,password) {
  try {
    connection = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: "localhost/xe"
    });
  } catch (err) {
    return false;
  }
}

async function renderData(){
    sql = `SELECT nama_buku,genre_buku,jenis_buku FROM buku`;
    binds = {};
    let temp = await getData(sql,binds);
    return temp;
}
async function getData(sql,binds){
  options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    autoCommit : true,
    resultSet : true
    // extendedMetaData: true,               // get extra metadata
    // prefetchRows:     100,                // internal buffer allocation size for tuning
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };  
  try{
      // For a complete list of options see the documentation.
    let row;
    let rows = [];
    i = 0;
    const tempQuery = await connection.execute(sql, binds, options);
    const tempResult = tempQuery.resultSet;
    while ((row = await tempResult.getRow())){
      console.log(row,i++);
      rows.push(row);
      result = rows;
    }
    await tempResult.close();
    return true;
    }
  catch(err){
    return false;
  }
}