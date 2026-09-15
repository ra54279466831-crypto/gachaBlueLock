import { pool } from "./connection.js";

const characterQuery = `
  SELECT c.id_caracters AS id, c.name AS nome, c.raridade, c.imagem, c.overall,
    p.posicao1, p.posicao2, p.posicao3,
    q.ataque, q.tecnica, q.velocidade, q.visao,
    a.atributo1 AS qualidade1, a.atributo2 AS qualidade2, a.atributo3 AS qualidade3
  FROM tb_caracters c
  INNER JOIN tb_posicoes p ON p.id_posicoes = c.id_posicoes
  INNER JOIN tb_qualidades q ON q.id_qualidades = c.id_qualidades
  INNER JOIN tb_atributos a ON a.id_atributos = c.id_atributos
`;

function normalizeCharacter(row) {
  return { id: Number(row.id), nome: row.nome, raridade: row.raridade, imagem: row.imagem,
    overall: Number(row.overall),
    posicoes: [row.posicao1, row.posicao2, row.posicao3].filter(Boolean),
    atributos: { ataque: Number(row.ataque), tecnica: Number(row.tecnica), velocidade: Number(row.velocidade), visao: Number(row.visao) },
    qualidades: [row.qualidade1, row.qualidade2, row.qualidade3].filter(Boolean) };
}

export async function listCharacters() {
  const [rows] = await pool.query(`${characterQuery} ORDER BY c.overall DESC, c.name`);
  return rows.map(normalizeCharacter);
}

export async function findCharacterById(id) {
  const [rows] = await pool.query(`${characterQuery} WHERE c.id_caracters = ?`, [id]);
  return rows[0] ? normalizeCharacter(rows[0]) : null;
}