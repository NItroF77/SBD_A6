// myscript.js
// This example uses Node 8's async/await syntax.

const oracledb = require('oracledb');
const express = require('express');
const app = express();
let status_login = false;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
let result = [{
  NAMA_BUKU: '',
  GENRE_BUKU: '',
  JENIS_BUKU: ''
}];
let connection;
let bodyParser = require('body-parser');
const configApp = () =>{
  app.use(bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true}
  ));
  app.use('/assets', [
    express.static(__dirname + '/node_modules/jquery/dist/'),
    express.static(__dirname + '/node_modules/poppers/dist/'),
    express.static(__dirname + '/node_modules/bootstrap/dist/')
  ]);
  app.use('/login-assets', [
    express.static(__dirname + '/etc/login/')
  ]);
  app.use('/elements', [
    express.static(__dirname + '/elements')
  ]);
  app.use('/style',[
    express.static(__dirname + '/views/style')
  ]);
  app.listen(1522, () => {
    console.log("server ready");
  });
  app.set("view engine", "ejs");
  app.set("views", "views");
}

const setGet = () =>{
  app.get("/", (req, res) => {
    let data_status;
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
}

const setPost = () =>{
  app.post("/post_buku", (req, res) => {
    sql = `insert into buku(nama_buku,genre_buku,jenis_buku) values(:1,:2,:3)`;
    binding = [req.body.nama_buku,req.body.genre_buku,req.body.jenis_buku];
    post_status = getData(sql,binding);
    console.log(post_status);
    res.redirect("/");
});
}

async function connectDb() {
  try {
    connection = await oracledb.getConnection({
      user: "A6",
      password: "A6",
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
    const tempQuery = await connection.execute(sql, binds, options);
    const tempResult = tempQuery.resultSet;
    while ((row = await tempResult.getRow())){
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

function run (){
  connectDb();
  renderData();
  configApp();
  setGet();
  setPost();
}
run();