
const renderMesin = async (result) => {
    sql = `SELECT id_mesin,tipe_mesin,kondisi,status_peminjaman FROM mesin where status_peminjaman = 0`;
    binds = [];
    result = await getData(sql, binds);
}
export default renderMesin;