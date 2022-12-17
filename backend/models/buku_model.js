const { getData, insertData } = require("./model.js");

const renderBuku = async () => {
  sql = `SELECT nama_buku,genre_buku,jenis_buku,deskripsi FROM buku`;
  binds = [];
  return await getData(sql, binds);

}
const renderAuthor = async () => {
  sql = `SELECT NAMA FROM PENULIS`;
  binds = [];
  return await getData(sql, binds);
}
const add_buku = async (data, result) => {
  sql = `insert into buku(nama_buku,genre_buku,jenis_buku,deskripsi) values(:1,:2,:3,${data.deskripsi})`;
  binding = [[data.nama_buku, data.genre_buku, data.jenis_buku]];
  await insertData(sql, binding);
}
const add_author = async (data, result) => {
  console.log(data.nama_author);
  let sql = `insert into penulis(nama) values('${data.nama_author}')`;
  result = await getData(sql, []);
}
const add_listAutborBuku = async (data, result) => {
  sql = 'insert into "penulis-buku"(buku_nama_buku,penulis_nama) values(:1,:2)';
  binding = [];
  if (Array.isArray(data.author_buku)) {
    for (authors of data.author_buku) {
      binding.push([data.nama_buku, authors]);
    }
  } else {
    binding.push([data.nama_buku, data.author_buku]);
  }
  await insertData(sql, binding);
}
module.exports = { renderBuku, renderAuthor, add_buku, add_author, add_listAutborBuku };