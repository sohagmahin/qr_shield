import * as SQLite from "expo-sqlite";

export function openDatabase() {
  const db = SQLite.openDatabase("db.db");
  return db;
}

export function createTable() {
  const db = openDatabase();
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists items (id integer primary key autoincrement not null, name text, description text,type text,data text);"
    );
  });
}

export function insertItem(
  name: string,
  description: string,
  type: string,
  data: string
) {
  const db = openDatabase();
  db.transaction((tx) => {
    tx.executeSql(
      "insert into items (name, description, type, data) values (?, ?, ?, ?)",
      [name, description, type, data]
    );
  });
}

export function updateItem(
  id: number,
  name: string,
  description: string,
  type: string,
  data: string
) {
  const db = openDatabase();
  db.transaction((tx) => {
    tx.executeSql(
      "update items set name = ?, description = ?, type = ?, data = ? where id = ?",
      [name, description, type, data, id]
    );
  });
}

export function deleteItem(id: number) {
  const db = openDatabase();
  db.transaction((tx) => {
    tx.executeSql("delete from items where id = ?", [id]);
  });
}

export function getItems() {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("select * from items", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

//close db
export function closeDatabase() {
  const db = openDatabase();
  db.closeAsync();
}
