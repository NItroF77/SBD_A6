const buku = require("../models/buku_model.js");
const tambah_buku = async (req,res) =>{
    buku.add_buku(req.body,result);
    buku.add_listAutborBuku(req.body,result);
    res.redirect("/tambah_buku");
}
const tambah_author = async (req,res) =>{
    buku.add_author(req.body,result);
    res.redirect("/tambah_buku");
};
const getBuku = async (req,res) =>{
    res.json(await buku.renderBuku());
    console.log("aaa");
}
const getAuthor = (req,res) =>{
    res.json(buku.renderAuthor());
}
module.exports = {tambah_buku,tambah_author,getBuku,getAuthor}