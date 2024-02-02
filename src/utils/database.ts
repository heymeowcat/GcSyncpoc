import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'pocDatabase.db',
  location: 'default',
});

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, timestamp INTEGER);',
      'CREATE TABLE IF NOT EXISTS datesyncs (id INTEGER PRIMARY KEY AUTOINCREMENT, datetime TEXT);',
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

export const insertDateSync = (content: string) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO datesyncs (id, content) VALUES (1, ?)',
        [content],
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

export const getDateSync = () => {
  return new Promise<string | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT content FROM datesyncs WHERE id = 1',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0).content);
          } else {
            resolve(null);
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
