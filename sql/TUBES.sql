--insert pelanggan
insert into pelanggan
values('0000000002','abcdefghijkl0002','Hanri','L',TO_DATE(sysdate),'DAGO','G000000001');

--insert tipe membership
insert into membership
values('G000000001','GOLD',50000);

--insert stok buku
insert into stok_buku
values('00A0000002',(select nama_buku from buku where nama_buku = 'A'),'FL001RK001',0,'RK1B2');

--update stok buku
update stok_buku
set BARIS_RAK = 'RK1B2'
where baris_rak = 'RK1B12';


--cek tiap table
select * from pelanggan;
select * from pustakawan;
select * from layanan;
select * from "plg-plg";
select * from P_BUKU;
select * from stok_buku;
select * from "p-buku";
select * from rak;

--cek siapa saja yang meminjam buku bernama 'A'
select nama from pelanggan
inner join layanan on pelanggan.id_pelanggan = layanan.pelanggan_id_pelanggan
inner join p_buku on layanan.id_layanan = p_buku.layanan_id_layanan
inner join "p-buku" on "p-buku".P_buku_ID_PEMINJAMAN = p_buku.id_peminjaman
inner join stok_buku on stok_buku.id_buku = "p-buku".STOK_BUKU_ID_BUKU
where stok_buku.buku_nama_buku = 'A';



--insert pustakawan
insert into pustakawan
values('ABCDE00001','Radit',TO_DATE(sysdate),'Garut');

--insert layanan
insert into layanan
values('L000000002',(select id_pelanggan from pelanggan where id_pelanggan='0000000002'));

--insert siapa yang melayani
insert into "plg-plg"
values((select id_pustakawan from pustakawan where id_pustakawan = 'ABCDE00001'),
(select id_pelanggan from pelanggan where id_pelanggan ='0000000002'),TO_DATE(sysdate));

--insert P_BUKU (Peminjaman)
insert into P_BUKU
values('P000000002',TO_DATE(sysdate),TO_DATE(sysdate + 5),0,0,0,'L000000002');

--insert p-buku, id peminjaman dan stok buku
insert into "p-buku"
values((select id_peminjaman from P_Buku where id_peminjaman = 'P000000002'),(select id_buku from stok_buku 
where stok_buku.buku_nama_buku = 'A' and stok_buku.status_peminjaman < 1));

--update stok buku setelah insert p-buku
update stok_buku
set status_peminjaman = 1
where id_buku = '00A0000002';

-- ========MESIN DAN TEKNISI==========

select * from teknisi;
select * from mesin;
select * from layanan;

insert into TEKNISI
values('GHIJK00001','Zahri',TO_DATE(sysdate),'Sukbum');

insert into mesin
values('FC00000001','FC','3');

--insert layanan
insert into layanan
values('L000000003',(select id_pelanggan from pelanggan where id_pelanggan='0000000001'));

insert into P_Mesin
values('PFC0000001','