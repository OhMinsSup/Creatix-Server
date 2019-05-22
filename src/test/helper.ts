import { Connection } from 'typeorm';
import { createConnect } from '../connectdb';

type EntitiesType = {
  name: string;
  tableName: string;
};

export async function getEntities(connection: Connection) {
  const entities: EntitiesType[] = [];
  try {
    await Promise.all([
      connection.entityMetadatas.forEach(e => {
        return entities.push({ name: e.name, tableName: e.tableName });
      })
    ]);
    return entities;
  } catch (e) {
    throw new Error(e);
  }
}

export async function createDatabase() {
  try {
    const connection = await createConnect(true);
    return connection;
  } catch (e) {
    throw new Error(e);
  }
}

export async function closeDatabase(connection: Connection) {
  try {
    const db = await connection;
    if (db.isConnected) {
      await db.close();
    }
    return;
  } catch (e) {
    throw new Error(e);
  }
}

export async function clearDatabase(entities: EntitiesType[], connection: Connection) {
  try {
    for (const entity of entities) {
      const repository = await connection.getRepository(entity.name);
      await repository.query(`DELETE FROM public.${entity.tableName};`);
    }
    return;
  } catch (e) {
    throw new Error(e);
  }
}
