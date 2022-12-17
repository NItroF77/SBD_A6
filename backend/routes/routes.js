const express = require('express');
const cBuku = require("../controllers/buku_controller.js");

const router = express.Router();
router.get("/buku",cBuku.getBuku);
router.get("/author",cBuku.getAuthor);
/*
app.get("/", async (req, res) => {
    buku = await renderBuku();
    if (!buku) {res.render("index", { title: "Error" });}
    else {res.render("index", { listBuku: buku, title: "OracleDb Simulation"});}
  });
  app.get("/login",(req,res) =>{
    if(status_login){
      res.redirect("/");
    }
    else{res.render("login",{Alert:"d-none"});}
  });
  app.get("/add_buku", async (req, res) => {
    author = await renderAuthor();
    res.render("add_buku", { title: "Penambahan Buku", listAuthor: author});
  });

  app.get("/add_author", async (req, res) => {
    author = await renderAuthor();
    res.render("add_author", { title: "Penambahan Author", listAuthor: author});
  });

  app.get("/registrasi", (req, res) => {
    res.render("add_membership", { title: "Penambahan Membership"});
  });
  app.get("/sunting-buku", async (req, res) => {
    buku = await renderBuku();
    res.render("sunting-buku", { title: "Sunting Info Buku", listBuku: buku});
  });
  app.get("/tambah_stok_buku", async (req, res) => {
    buku = await renderBuku();
    res.render("add_stok_buku", { title: "Penambahan Stok Buku", listBuku: buku});
  });
  app.get("/tambah-mesin", async (req, res) => {
    res.render("add_mesin", { title: "Penambahan Mesin"});
  });
  app.get("/p-buku", async (req, res) => {
    res.render("p-buku", { title: "Peminjaman Buku"});
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

  app.post("/post_buku", cBuku.tambah_buku);
  app.post("/tambah-author", cBuku.tambah_author);
  app.post("/register", async (req, res) => {
    let id = await generateID("pelanggan","","");
    console.log(id,req.body);
    sql = `BEGIN
          registrasi('${id}','${req.body.NIK}','${req.body.nama_plg}','${req.body.kelamin}',
                      TO_DATE('${req.body.tgl_lahir}','DD-MM-YYYY'),'${req.body.alamat}','${req.body.membership}');
          END;`;
    let temp = await insertData(sql, []);
    res.redirect("/registrasi");
  });
  app.post("/sunting_buku", async (req, res) => {
    sql = `update buku set deskripsi = '${req.body.deskripsi}',genre_buku ='${req.body.genre_buku}',jenis_buku = '${req.body.jenis_buku}' where nama_buku = '${req.body.nama_buku}'`
    temp = await insertData(sql,[]);
    res.redirect("/");
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
  app.post("/add_mesin",async(req,res) =>{
    let id = await generateID("mesin",`${req.body.mesin}`,`where tipe_mesin = '${req.body.mesin}'`);
    sql = `insert into mesin(id_mesin,tipe_mesin,kondisi,status_peminjaman) values('${id}','${req.body.mesin}','3','0')`;
    temp = await insertData(sql,[]);
    res.redirect("/");
  });
  app.post("/p_buku", async (req, res) => {
    let id_layanan = await generateID(`layanan`,"L","");
    let id_peminjaman = await generateID(`"p-buku"`,"P","");
    sql = `BEGIN
      PINJAMBUKU ( '${req.body.id_buku}','${id_layanan}','${req.body.id_plg}', '${id_peminjaman}');
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
    let id_layanan = await generateID(`layanan`,"L","");
    let id_peminjaman = await generateID(`P_MESIN`,"P","");
    sql = `BEGIN
          PINJAMMESIN('${id_layanan}','${req.body.id_plg}','${id_peminjaman}','${req.body.mesin}');
           END;`;
    temp = await insertData(sql,[]);
    res.redirect("/");
  });
  app.post("/pp_mesin",async (req,res) =>{
  sql = `BEGIN
  ReturnMesin('${req.body.id_mesin}');
   END;`;
  temp = await insertData(sql,[]);
  res.redirect("/");
  });
*/
module.exports = router;