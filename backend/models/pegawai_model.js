
const renderPegawai = async (result) => {
    sql = `SELECT id_pustakawan,nama,status FROM pustakawan`;
    binds = [];
    result = await getData(sql, binds);
}
export default renderPegawai;