ALTER TABLE tb_users ADD COLUMN profile_image LONGTEXT NULL, ADD COLUMN diamonds INT NOT NULL DEFAULT 12450;
CREATE TABLE tb_teams (id_team INT AUTO_INCREMENT PRIMARY KEY, id_user INT NOT NULL UNIQUE, name VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (id_user) REFERENCES tb_users(id_user) ON DELETE CASCADE);
CREATE TABLE tb_team_players (id_team INT NOT NULL, slot_id VARCHAR(30) NOT NULL, id_caracters INT NOT NULL, PRIMARY KEY (id_team, slot_id), UNIQUE KEY unique_character_per_team (id_team, id_caracters), FOREIGN KEY (id_team) REFERENCES tb_teams(id_team) ON DELETE CASCADE, FOREIGN KEY (id_caracters) REFERENCES tb_caracters(id_caracters));

ALTER TABLE tb_users
  ADD COLUMN profile_image LONGTEXT NULL,
  ADD COLUMN diamonds INT NOT NULL DEFAULT 12450;

  INSERT INTO tb_posicoes (posicao1, posicao2, posicao3)
VALUES ('ST', 'FW', 'CAM');

INSERT INTO tb_atributos (atributo1, atributo2, atributo3)
VALUES ('Finalização', 'Drible', 'Visão de jogo');

INSERT INTO tb_qualidades (ataque, tecnica, velocidade, visao)
VALUES (89, 86, 80, 88);

INSERT INTO tb_caracters
(name, raridade, imagem, overall, id_posicoes, id_atributos, id_qualidades)
VALUES
(
  'Itoshi Rin',
  'Lendário',
  './img/Gacha-Rin.jpg',
  87,
  1,
  1,
  1
);