-- Active: 1789471383031@@127.0.0.1@3306@gacha
CREATE DATABASE IF NOT EXISTS gacha CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gacha;

CREATE TABLE tb_users (id_user INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(150) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(150) NOT NULL UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE tb_posicoes (id_posicoes INT AUTO_INCREMENT PRIMARY KEY, posicao1 VARCHAR(30) NOT NULL, posicao2 VARCHAR(30) NOT NULL, posicao3 VARCHAR(30) NOT NULL);
CREATE TABLE tb_atributos (id_atributos INT AUTO_INCREMENT PRIMARY KEY, atributo1 VARCHAR(30) NOT NULL, atributo2 VARCHAR(30) NOT NULL, atributo3 VARCHAR(30) NOT NULL);
CREATE TABLE tb_qualidades (id_qualidades INT AUTO_INCREMENT PRIMARY KEY, ataque INT NOT NULL, tecnica INT NOT NULL, velocidade INT NOT NULL, visao INT NOT NULL);
CREATE TABLE tb_caracters (id_caracters INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(150) NOT NULL, raridade VARCHAR(40) NOT NULL, imagem VARCHAR(250) NOT NULL, overall INT NOT NULL, id_posicoes INT NOT NULL, id_atributos INT NOT NULL, id_qualidades INT NOT NULL, FOREIGN KEY (id_posicoes) REFERENCES tb_posicoes(id_posicoes), FOREIGN KEY (id_atributos) REFERENCES tb_atributos(id_atributos), FOREIGN KEY (id_qualidades) REFERENCES tb_qualidades(id_qualidades));
CREATE TABLE tb_storage (id_user INT NOT NULL, id_caracters INT NOT NULL, PRIMARY KEY (id_user, id_caracters), FOREIGN KEY (id_user) REFERENCES tb_users(id_user), FOREIGN KEY (id_caracters) REFERENCES tb_caracters(id_caracters));