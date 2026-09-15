import { pool } from "./connection.js";
import { findCharacterById, listCharacters } from "./caractersRepo.js";

export async function listUserCharacters(userId) {
  const [rows] = await pool.query("SELECT id_caracters FROM tb_storage WHERE id_user = ? ORDER BY id_caracters", [userId]);
  const characters = await Promise.all(rows.map(({ id_caracters }) => findCharacterById(id_caracters)));
  return characters.filter(Boolean);
}

export async function addCharacterToStorage(userId, characterId, connection = pool) {
  await connection.query("INSERT IGNORE INTO tb_storage (id_user, id_caracters) VALUES (?, ?)", [userId, characterId]);
  return findCharacterById(characterId);
}

export async function spinGacha(userId, count) {
  const cost = count === 10 ? 1350 : 150;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [users] = await connection.query("SELECT diamonds FROM tb_users WHERE id_user = ? FOR UPDATE", [userId]);
    if (!users[0]) throw Object.assign(new Error("Usu�rio n�o encontrado."), { status: 404 });
    if (Number(users[0].diamonds) < cost) throw Object.assign(new Error("Diamantes insuficientes."), { status: 400 });
    const characters = await listCharacters();
    if (!characters.length) throw Object.assign(new Error("N�o h� personagens cadastrados no banco."), { status: 400 });
    const draw = () => characters[Math.floor(Math.random() * characters.length)];
    const results = Array.from({ length: count }, draw);
    for (const character of results) await addCharacterToStorage(userId, character.id, connection);
    const diamonds = Number(users[0].diamonds) - cost;
    await connection.query("UPDATE tb_users SET diamonds = ? WHERE id_user = ?", [diamonds, userId]);
    await connection.commit();
    return { results, diamonds };
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}