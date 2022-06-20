import { createPool, Pool } from 'mysql';
import 'dotenv/config';

let pool: Pool;

export const init = () => {
    try {
      pool = createPool({
        connectionLimit: 10,
        waitForConnections: true ,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT),
        charset: 'utf8',
        multipleStatements: false  // 다중쿼리 허용 X
      });
  
      console.debug('MySql Adapter Pool generated successfully');
    } catch (error) {
      console.error('[mysql.connector][init][Error]: ', error);
      throw new Error('failed to initialized pool');
    }
};

(async function(){
    await init(); //initalized 
})();

export const execute = <T>(query: string, params: string[] | Object): Promise<T> => {
    try {
      if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');
  
      return new Promise<T>((resolve, reject) => {
        pool.query(query, params, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
  
    } catch (error) {
      console.error('[mysql.connector][execute][Error]: ', error);
      throw new Error('failed to execute MySQL query');
    }
  }
