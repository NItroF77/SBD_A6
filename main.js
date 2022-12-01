// myscript.js
// This example uses Node 8's async/await syntax.

const oracledb = require('oracledb');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let status_login = false;
let buku, mesin, pegawai, author, member, rak;
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
    express.static(__dirname + '/node_modules/poppers/dist/'),
    express.static(__dirname + '/node_modules/bootstrap/dist/')
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
  app.listen(1522, () => {
    console.log("server ready");
  });
  app.set("view engine", "ejs");
  app.set("views", "views");
}

const setGet = () => {
  app.get("/", async (req, res) => {
    let data_status;
    data_status = await renderBuku();
    if (data_status) {
      res.render("index", { listBuku: buku, title: "OracleDb Simulation" });
      return true;
    }
    else {
      res.render("index", { title: "Error" });
      return false;
    }
  });

  app.get("/add_buku", async (req, res) => {
    await renderAuthor();
    res.render("add_buku", { title: "Penambahan Buku", listAuthor: author });
  });

  app.get("/add_author", async (req, res) => {
    await renderAuthor();
    res.render("add_author", { title: "Penambahan Author", listAuthor: author });
  });

  app.get("/registrasi", (req, res) => {
    res.render("add_membership", { title: "Penambahan Membership" });
  });
  app.get("/tambah_stok_buku", async (req, res) => {
    await renderBuku();
    res.render("add_stok_buku", { title: "Penambahan Stok Buku", listBuku: buku });
  });
  app.get("/p-buku", async (req, res) => {
    await renderBuku();
    res.render("p-buku", { title: "Peminjaman Buku",listBuku:buku});
  });
  app.get("/pp-buku", async (req, res) => {
    res.render("pp-buku", { title: "Pengembalian Buku"});
  });
  app.get("/p-mesin", async (req, res) => {
    res.render("p-mesin", { title: "Peminjaman Mesin"});
  });
  app.get("/pp-mesin", async (req, res) => {
    res.render("pp-mesin", { title: "Pengembalian Mesin"});
  });
}

const setPost = () => {
  app.post("/post_buku", async (req, res) => {
    sql = `insert into buku(nama_buku,genre_buku,jenis_buku) values(:1,:2,:3)`;
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
    post_status = getData(sql, binding);
    console.log(post_status);
    res.redirect("/");
  });
  app.post("/login-user", (req, res) => {
    if (connectDb(req.body.username, req.body.password)) {
      status_login = true;
      res.redirect("/");
    }
  });
  app.post("/tambah-author", async (req, res) => {
    console.log(req.body.nama_author);
    let sql = `insert into penulis(nama) values(:1)`;
    let binds = [req.body.nama_author];
    console.log(binds);
    await getData(sql, binds, "author");
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
    let row = await getRow(`layanan`);
    let digit = 9 - row.length;
    console.log(digit);
    sRow = parseInt(row) + 1;
    let id_layanan = "L"+ "0".repeat(digit) + sRow.toString();
    row = await getRow(`"p-buku"`);
    digit = 9 - row.length;
    console.log(digit);
    sRow = parseInt(row) + 1;
    let id_peminjaman = "P" + "0".repeat(digit) + sRow.toString();
    sql = `BEGIN
      PINJAMBUKU ( '${id_layanan}','${req.body.id_plg}', '${id_peminjaman}','${req.body.nama_buku}');
     END;`;
    temp = await insertData(sql, []);
    console.log(id_layanan,id_peminjaman,req.body);
    res.redirect("/");
  });
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
  return getData(sql, binds, "buku");
}
async function renderAuthor() {
  sql = `SELECT NAMA FROM PENULIS`;
  binds = [];
  return getData(sql, binds, "author");
}
async function renderMesin() {
  sql = `SELECT id_mesin,tipe_mesin,kondisi,status_peminjaman FROM mesin`;
  binds = [];
  return getData(sql, binds, "mesin");
}
async function renderPegawai() {
  sql = `SELECT id_pustakawan,nama,status FROM pustakawan`;
  binds = [];
  return getData(sql, binds, "pegawai");
}

async function getData(sql, binds, type) {
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
      switch (type) {
        case "buku": buku = JSON.parse(JSON.stringify(rows)); break;
        case "author": author = JSON.parse(JSON.stringify(rows)); break;
        case "mesin": mesin = JSON.parse(JSON.stringify(rows)); break;
        case "pegawai": pegawai = JSON.parse(JSON.stringify(rows)); break;
        case "member": member = JSON.parse(JSON.stringify(rows)); break;
        default: ;
      }
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
    return true;
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

      switch (type) {
        case "buku": buku = JSON.parse(JSON.stringify(rows)); break;
        case "author": author = JSON.parse(JSON.stringify(rows)); break;
        case "mesin": mesin = JSON.parse(JSON.stringify(rows)); break;
        case "pegawai": pegawai = JSON.parse(JSON.stringify(rows)); break;
        case "member": member = JSON.parse(JSON.stringify(rows)); break;
        default: ;
      }
      await tempResult.close();
    }
    else {
      const rows = await connection.executeMany(sql, binds, options);
    }
    console.log(rows);
    return true;
  }
  catch (err) {
    return false;
  }
}

async function getRow(table) {
  let sql = `select count(*) as total from ${table}`;
  let temp;
  options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    autoCommit: true,
    resultSet: true
    // extendedMetaData: true,               // get extra metadata
    // prefetchRows:     100,                // internal buffer allocation size for tuning
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    temp = await connection.execute(sql);
    // For a complete list of options see the documentation.
    if(isNaN((JSON.stringify(temp))["rows"][0].TOTAL)) return "0";
    return JSON.parse(JSON.stringify(temp))["rows"][0].TOTAL.toString();
  }
  catch (err) {
    return "0";
  }
}



function run() {
  connectDb();
  configApp();
  setGet();
  setPost();
}
run();