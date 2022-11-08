-- Generated by Oracle SQL Developer Data Modeler 20.2.0.167.1538
--   at:        2022-11-08 08:27:13 ICT
--   site:      Oracle Database 11g
--   type:      Oracle Database 11g



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE buku (
    nama_buku   VARCHAR2(30 CHAR) NOT NULL,
    genre_buku  VARCHAR2(15 CHAR) NOT NULL,
    jenis_buku  VARCHAR2(15 CHAR) NOT NULL
);

ALTER TABLE buku ADD CONSTRAINT buku_pk PRIMARY KEY ( nama_buku );

CREATE TABLE layanan (
    id_layanan              CHAR(10 CHAR) NOT NULL,
    pelanggan_id_pelanggan  CHAR(10 CHAR) NOT NULL,
    p_mesin_id_peminjaman   CHAR(10 CHAR) NOT NULL
);

CREATE UNIQUE INDEX layanan__idx ON
    layanan (
        p_mesin_id_peminjaman
    ASC );

ALTER TABLE layanan ADD CONSTRAINT layanan_pk PRIMARY KEY ( id_layanan );

CREATE TABLE membership (
    kode_member  CHAR(10 CHAR) NOT NULL,
    tipe_member  VARCHAR2(7 CHAR) NOT NULL,
    harga        INTEGER NOT NULL
);

ALTER TABLE membership ADD CONSTRAINT membership_pk PRIMARY KEY ( kode_member );

CREATE TABLE mesin (
    id_mesin               VARCHAR2(10 CHAR) NOT NULL,
    tipe_mesin             VARCHAR2(15 CHAR) NOT NULL,
    kondisi                VARCHAR2(1 CHAR) NOT NULL,
    p_mesin_id_peminjaman  CHAR(10 CHAR) NOT NULL
);

ALTER TABLE mesin ADD CONSTRAINT mesin_pk PRIMARY KEY ( id_mesin,
                                                        p_mesin_id_peminjaman );

CREATE TABLE p_buku (
    id_peminjaman       CHAR(10 CHAR) NOT NULL,
    start_date          DATE NOT NULL,
    end_date            DATE NOT NULL,
    is_overdue          CHAR(1),
    overdue_days        INTEGER,
    denda               INTEGER,
    layanan_id_layanan  CHAR(10 CHAR) NOT NULL
);

CREATE UNIQUE INDEX p_buku__idx ON
    p_buku (
        layanan_id_layanan
    ASC );

ALTER TABLE p_buku ADD CONSTRAINT p_buku_pk PRIMARY KEY ( id_peminjaman );

CREATE TABLE p_mesin (
    id_peminjaman  CHAR(10 CHAR) NOT NULL,
    start_time     DATE NOT NULL,
    end_time       DATE NOT NULL
);

ALTER TABLE p_mesin ADD CONSTRAINT p_mesin_pk PRIMARY KEY ( id_peminjaman );

CREATE TABLE "p-buku" (
    p_buku_id_peminjaman  CHAR(10 CHAR) NOT NULL,
    stok_buku_id_buku     CHAR(10 CHAR) NOT NULL
);

ALTER TABLE "p-buku" ADD CONSTRAINT "p-buku_PK" PRIMARY KEY ( p_buku_id_peminjaman,
                                                              stok_buku_id_buku );

CREATE TABLE pelanggan (
    id_pelanggan            CHAR(10 CHAR) NOT NULL,
    nik                     CHAR(16 CHAR) NOT NULL,
    nama                    VARCHAR2(30 CHAR) NOT NULL,
    jenis_kelamin           CHAR(1) NOT NULL,
    tgl_lahir               DATE NOT NULL,
    alamat                  CLOB NOT NULL,
    membership_kode_member  CHAR(10 CHAR) NOT NULL
);

CREATE UNIQUE INDEX pelanggan__idx ON
    pelanggan (
        membership_kode_member
    ASC );

ALTER TABLE pelanggan ADD CONSTRAINT pelanggan_pk PRIMARY KEY ( id_pelanggan );

CREATE TABLE penulis (
    nama            VARCHAR2(30 CHAR) NOT NULL,
    buku_nama_buku  VARCHAR2(30 CHAR) NOT NULL
);

ALTER TABLE penulis ADD CONSTRAINT penulis_pk PRIMARY KEY ( buku_nama_buku );

CREATE TABLE perawatan (
    mesin_id_mesin               VARCHAR2(10 CHAR) NOT NULL,
    mesin_p_mesin_id_peminjaman  CHAR(10 CHAR) NOT NULL,
    teknisi_id_teknisi           CHAR(10 CHAR) NOT NULL,
    start_date                   DATE NOT NULL,
    end_date                     DATE
);

ALTER TABLE perawatan
    ADD CONSTRAINT perawatan_pk PRIMARY KEY ( mesin_id_mesin,
                                              mesin_p_mesin_id_peminjaman,
                                              teknisi_id_teknisi );

CREATE TABLE "plg-plg" (
    pustakawan_id_pustakawan  CHAR(10 CHAR) NOT NULL,
    pelanggan_id_pelanggan    CHAR(10 CHAR) NOT NULL,
    waktu_pelayanan           DATE NOT NULL
);

ALTER TABLE "plg-plg" ADD CONSTRAINT "plg-plg_PK" PRIMARY KEY ( pustakawan_id_pustakawan,
                                                                pelanggan_id_pelanggan );

CREATE TABLE pustakawan (
    id_pustakawan  CHAR(10 CHAR) NOT NULL,
    nama           VARCHAR2(30 CHAR) NOT NULL,
    tgl_lahir      DATE NOT NULL,
    alamat         CLOB NOT NULL
);

ALTER TABLE pustakawan ADD CONSTRAINT pustakawan_pk PRIMARY KEY ( id_pustakawan );

CREATE TABLE rak (
    id_rak  CHAR(10 CHAR) NOT NULL,
    lokasi  VARCHAR2(15 CHAR) NOT NULL
);

ALTER TABLE rak ADD CONSTRAINT rak_pk PRIMARY KEY ( id_rak );

CREATE TABLE stok_buku (
    id_buku         CHAR(10 CHAR) NOT NULL,
    buku_nama_buku  VARCHAR2(30 CHAR) NOT NULL,
    rak_id_rak      CHAR(10 CHAR),
    baris_rak       CHAR(6 CHAR)
);

ALTER TABLE stok_buku
    ADD CHECK ( ( rak_id_rak IS NULL
                  AND baris_rak IS NULL )
                OR ( rak_id_rak IS NOT NULL
                     AND baris_rak IS NOT NULL ) );

ALTER TABLE stok_buku ADD CONSTRAINT stok_buku_pk PRIMARY KEY ( id_buku );

CREATE TABLE teknisi (
    id_teknisi  CHAR(10 CHAR) NOT NULL,
    nama        VARCHAR2(30 CHAR) NOT NULL,
    tgl_lahir   DATE NOT NULL,
    alamat      CLOB NOT NULL
);

ALTER TABLE teknisi ADD CONSTRAINT teknisi_pk PRIMARY KEY ( id_teknisi );

ALTER TABLE layanan
    ADD CONSTRAINT layanan_p_mesin_fk FOREIGN KEY ( p_mesin_id_peminjaman )
        REFERENCES p_mesin ( id_peminjaman );

ALTER TABLE layanan
    ADD CONSTRAINT layanan_pelanggan_fk FOREIGN KEY ( pelanggan_id_pelanggan )
        REFERENCES pelanggan ( id_pelanggan );

ALTER TABLE mesin
    ADD CONSTRAINT mesin_p_mesin_fk FOREIGN KEY ( p_mesin_id_peminjaman )
        REFERENCES p_mesin ( id_peminjaman );

ALTER TABLE p_buku
    ADD CONSTRAINT p_buku_layanan_fk FOREIGN KEY ( layanan_id_layanan )
        REFERENCES layanan ( id_layanan );

ALTER TABLE "p-buku"
    ADD CONSTRAINT "p-buku_p_buku_FK" FOREIGN KEY ( p_buku_id_peminjaman )
        REFERENCES p_buku ( id_peminjaman );

ALTER TABLE "p-buku"
    ADD CONSTRAINT "p-buku_stok_buku_FK" FOREIGN KEY ( stok_buku_id_buku )
        REFERENCES stok_buku ( id_buku );

ALTER TABLE pelanggan
    ADD CONSTRAINT pelanggan_membership_fk FOREIGN KEY ( membership_kode_member )
        REFERENCES membership ( kode_member );

ALTER TABLE penulis
    ADD CONSTRAINT penulis_buku_fk FOREIGN KEY ( buku_nama_buku )
        REFERENCES buku ( nama_buku );

ALTER TABLE perawatan
    ADD CONSTRAINT perawatan_mesin_fk FOREIGN KEY ( mesin_id_mesin,
                                                    mesin_p_mesin_id_peminjaman )
        REFERENCES mesin ( id_mesin,
                           p_mesin_id_peminjaman );

ALTER TABLE perawatan
    ADD CONSTRAINT perawatan_teknisi_fk FOREIGN KEY ( teknisi_id_teknisi )
        REFERENCES teknisi ( id_teknisi );

ALTER TABLE "plg-plg"
    ADD CONSTRAINT "plg-plg_Pelanggan_FK" FOREIGN KEY ( pelanggan_id_pelanggan )
        REFERENCES pelanggan ( id_pelanggan );

ALTER TABLE "plg-plg"
    ADD CONSTRAINT "plg-plg_Pustakawan_FK" FOREIGN KEY ( pustakawan_id_pustakawan )
        REFERENCES pustakawan ( id_pustakawan );

ALTER TABLE stok_buku
    ADD CONSTRAINT stok_buku_buku_fk FOREIGN KEY ( buku_nama_buku )
        REFERENCES buku ( nama_buku );

ALTER TABLE stok_buku
    ADD CONSTRAINT stok_buku_rak_fk FOREIGN KEY ( rak_id_rak )
        REFERENCES rak ( id_rak );



-- Oracle SQL Developer Data Modeler Summary Report: 
-- 
-- CREATE TABLE                            15
-- CREATE INDEX                             3
-- ALTER TABLE                             30
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0
