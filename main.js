// myscript.js
// This example uses Node 8's async/await syntax.
const oracledb =  require('oracledb');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let status_login = false;
session = {login_stat :"Login",action:"/login",method:"get"};
let connection;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];
const configApp = () => {
  app.use(bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }
  ));
  app.use('/assets', [
    express.static(__dirname + '/node_modules/jquery/dist/'),
    express.static(__dirname + '/node_modules/bootstrap/dist/'),
    express.static(__dirname + '/node_modules/bootstrap/scss/')
  ]);
  app.use('/login-assets', [
    express.static(__dirname + '/etc/login/')
  ]);
  app.use('/elements', [
    express.static(__dirname + '/elements')
  ]);
  app.use('/style', [
    express.static(__dirname + '/views/style')
  ]);
  app.use(express.json());
  app.listen(1522, () => {
    console.log("server ready");
  });
  app.set("view engine", "ejs");
  app.set("views", "views");
}

const setGet = () => {
  app.get("/", async (req, res) => {
    if(status_login){session = {login_stat :"Logout",action:"/logout",method:"post"};}
    else{session = {login_stat :"Login",action:"/login",method:"get"};}
    buku = await renderBuku();
    if (buku != false) {
      res.render("index", { listBuku: buku, title: "OracleDb Simulation",session:session});
      return true;
    }
    else {
      res.render("index", { title: "Error" });
    }
  });
  app.get("/login",(req,res) =>{
    if(status_login){
      res.redirect("/");
    }
    else{res.render("login",{Alert:"d-none"});}
  });
  app.get("/add_buku", async (req, res) => {
    author = await renderAuthor();
    res.render("add_buku", { title: "Penambahan Buku", listAuthor: author });
  });

  app.get("/add_author", async (req, res) => {
    author = await renderAuthor();
    res.render("add_author", { title: "Penambahan Author", listAuthor: author });
  });

  app.get("/registrasi", (req, res) => {
    res.render("add_membership", { title: "Penambahan Membership" });
  });
  app.get("/tambah_stok_buku", async (req, res) => {
    buku = await renderBuku();
    res.render("add_stok_buku", { title: "Penambahan Stok Buku", listBuku: buku });
  });
  app.get("/p-buku", async (req, res) => {
    buku = await renderBuku();
    res.render("p-buku", { title: "Peminjaman Buku",listBuku:buku});
  });
  app.get("/pp-buku", async (req, res) => {
    res.render("pp-buku", { title: "Pengembalian Buku"});
  });
  app.get("/p-mesin", async (req, res) => {
    mesin = await renderMesin();
    res.render("p-mesin", { title: "Peminjaman Mesin",listMesin:mesin});
  });
  app.get("/pp-mesin", async (req, res) => {
    res.render("pp-mesin", { title: "Pengembalian Mesin"});
  });
}

const setPost = () => {
  app.post("/post_buku", async (req, res) => {
    deskripsi = `'Dibuat oleh ${req.body.author_buku} \\n ${req.body.deskripsi}'`;
    sql = `insert into buku(nama_buku,genre_buku,jenis_buku,deskripsi) values(:1,:2,:3,${deskripsi})`;
    binding = [[req.body.nama_buku, req.body.genre_buku, req.body.jenis_buku]];
    post_status = await getData(sql, binding);
    sql = 'insert into "penulis-buku"(buku_nama_buku,penulis_nama) values(:1,:2)';
    binding = [];
    if (Array.isArray(req.body.author_buku)) {
      for (authors of req.body.author_buku) {
        binding.push([req.body.nama_buku, authors]);
      }
    }
    else {
      binding.push([req.body.nama_buku, req.body.author_buku]);
    }
    post_status = await getData(sql, binding);
    console.log(post_status);
    res.redirect("/");
  });
  app.post("/login-user", (req, res) => {
    if(req.body.username == "adm" && req.body.password =="adm"){
      status_login=true;
      res.redirect("/");
    }
  res.render("login",{Alert:""});
  });
  app.post("/logout",(req,res) =>{
    status_login = false;
    session.login_stat = "Login";
    session.action = "/login";
    session.method = "get";
    res.redirect("/");
  });
  app.post("/tambah-author", async (req, res) => {
    console.log(req.body.nama_author);
    let sql = `insert into penulis(nama) values('${req.body.nama_author}')`;
    await getData(sql, []);
    res.redirect("/add_author");
  });
  app.post("/register", async (req, res) => {
    let row = await getRow("pelanggan");
    let digit = 10 - row.length;
    row = parseInt(row) + 1;
    let id = "0".repeat(digit) + row.toString();
    sql = `BEGIN
          registrasi('${id}','${req.body.NIK}','${req.body.nama_plg}','${req.body.kelamin}',
                      TO_DATE('${req.body.tgl_lahir}','DD-MM-YYYY'),'${req.body.alamat}','${req.body.membership}');
          END;`;
    let temp = await insertData(sql, []);
    res.redirect("/registrasi");
  });
  app.post("/add_stok", async (req, res) => {
    sql = `insert into RAK(ID_RAK,LOKASI) values('${req.body.lantai + req.body.rak}','${req.body.lantai}')`;
    let temp = await insertData(sql, []);
    sql = `BEGIN
      ADDSTOK ( '${req.body.stok_id}','${req.body.nama_buku}', '${req.body.lantai + req.body.rak}', '0','${req.body.rak + req.body.baris}');
     END;`;
    temp = await insertData(sql, []);
    res.redirect("/tambah_stok_buku");
  });
  app.post("/p_buku", async (req, res) => {
    let id_layanan = await generateID(`layanan`,"L");
    let id_peminjaman = await generateID(`"p-buku"`,"P");
    console.log(id_layanan,id_peminjaman);
    sql = `BEGIN
      PINJAMBUKU ( '${id_layanan}','${req.body.id_plg}', '${id_peminjaman}','${req.body.nama_buku}');
     END;`;
    temp = await insertData(sql, []);
    res.redirect("/");
  });
  app.post("/pp_buku",async (req,res) =>{
    sql = `BEGIN
          ReturnBook('${req.body.id_buku}');
           END;`;
    temp = await insertData(sql,[]);
    res.redirect("/");
  });
  app.post("/p_mesin",async (req,res) =>{
    let id_layanan = await generateID(`layanan`,"L");
    let id_peminjaman = await generateID(`P_MESIN`,"P");
    sql = `BEGIN
          PINJAMMESIN('${id_layanan}','${req.body.id_plg}','${id_peminjaman}','${req.body.mesin}');
           END;`;
    temp = await insertData(sql,[]);
    res.redirect("/");
  });
}

async function generateID(entity,id){
  let temp = await getRow(entity);
  let digit = 9 - temp.length;
  let sRow = parseInt(temp) + 1;
  return id + "0".repeat(digit) + sRow.toString();
}
async function connectDb() {
  try {
    connection = await oracledb.getConnection({
      user: "TUBES",
      password: "TUBES",
      connectString: "localhost/xe"
    });
  } catch (err) {
    return false;
  }
}

async function renderBuku() {
  sql = `SELECT nama_buku,genre_buku,jenis_buku,deskripsi FROM buku`;
  binds = [];
  return await getData(sql, binds);
}
async function renderAuthor() {
  sql = `SELECT NAMA FROM PENULIS`;
  binds = [];
  return await getData(sql, binds);
}
async function renderMesin() {
  sql = `SELECT id_mesin,tipe_mesin,kondisi,status_peminjaman FROM mesin where status_peminjaman = 0`;
  binds = [];
  return await getData(sql, binds);
}
async function renderPegawai() {
  sql = `SELECT id_pustakawan,nama,status FROM pustakawan`;
  binds = [];
  return await getData(sql, binds);
}

async function getData(sql, binds) {
  options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    autoCommit: true,
    resultSet: true
    // extendedMetaData: true,               // get extra metadata
    // prefetchRows:     100,                // internal buffer allocation size for tuning
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    // For a complete list of options see the documentation.
    let row;
    let rows = [];
    if (binds.length <= 1) {
      if (binds.length == 1) { binds = binds[0]; }
      const tempQuery = await connection.execute(sql, binds, options);
      const tempResult = tempQuery.resultSet;
      while ((row = await tempResult.getRow())) {
        rows.push(row);
      }
      await tempResult.close();
    }
    else {
      options = {
        autoCommit: true,
        // batchErrors: true,  // continue processing even if there are data errors
        bindDefs: [
          { type: oracledb.STRING, maxSize:15 },
          { type: oracledb.STRING, maxSize:15 }
        ]
      };
      const tempQuery = await connection.executeMany(sql, binds, options);
    }
    return JSON.parse(JSON.stringify(rows));
  }
  catch (err) {
    return false;
  }
}

async function insertData(sql, binds) {
  options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    autoCommit: true,
    resultSet: true
    // extendedMetaData: true,               // get extra metadata
    // prefetchRows:     100,                // internal buffer allocation size for tuning
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    // For a complete list of options see the documentation.
    if (binds.length <= 1) {
      if (binds.length == 1) { binds = binds[0]; }
      const rows = await connection.execute(sql, binds, options);
    }
    else {
      const rows = await connection.executeMany(sql, binds, options);
    }
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

async function getRow(table) {
  sql = `select count(*) as total from ${table}`;
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



function run() {
  connectDb();
  configApp();
  setGet();
  setPost();
}
run();