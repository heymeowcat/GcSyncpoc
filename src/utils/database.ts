import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'pocDatabase.db',
  location: 'default',
});

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, timestamp INTEGER);',
    );
  });
};

export const insertData = (content: string, timestamp: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO data (content, timestamp) VALUES (?, ?)',
        [content, timestamp],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Failed to insert data'));
          }
        },
        (_, error) => reject(error),
      );
    });
  });
};

export const getData = () => {
  return new Promise<{id: number; content: string; timestamp: number}[]>(
    (resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM data', [], (_, results) => {
          const data: {id: number; content: string; timestamp: number}[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            data.push({
              id: row.id,
              content: row.content,
              timestamp: row.timestamp,
            });
          }
          resolve(data);
        });
      });
    },
  );
};
