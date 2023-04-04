const mysql = require('mysql');
require('dotenv').config();
/**
 * simple db driver
 */
class Db {
    static query='';
    /**
     * db driver constructor
     */
     constructor (host= null, user= null, password= null,database = null, lastQuery=''){
         this.connection = mysql.createConnection({
             host: (host === null ? process.env.DB_USER_HOST :host),
             user:  (host === null ?  process.env.DB_USER_NAME : user),
             password:  (host === null ? process.env.DB_PASSWORD : password),
             database: (host === null ?  process.env.DB_NAME : database),

         });
         Db.query =lastQuery;
     }

    /**
     * add fields list and table name query
     * @param tableName
     * @param fieldsList
     * @returns {Db}
     * @constructor
     */
     static Select(tableName, fieldsList="*"){
         Db.query+=`SELECT ${Array.isArray(tableName) ? fieldsList.join(", ") : fieldsList} FROM ${tableName} `;
         return new Db(null,null,null,null,this.query);
     }

    /**
     * add where condition to query
     * @param fieldName
     * @param operator
     * @param value
     * @returns {Db}
     * @constructor
     */
     where(fieldName, value, operator="="){
        Db.query+=`WHERE ${fieldName} ${operator} '${value}' `;
        return this;
     }

    /**
     * add AND condition to where statement
     * @param fieldName
     * @param value
     * @param operator
     * @returns {Db}
     */
     and(fieldName, value, operator="="){
        Db.query+=`AND ${fieldName} ${operator} '${value}' `;
         return this;
     }

    /**
     * add OR condition to where statement
     * @param fieldName
     * @param value
     * @param operator
     * @returns {Db}
     */
     or(fieldName, value, operator="="){
        Db.query+=`OR ${fieldName} ${operator} '${value}' `;
        return this;
     }


    /**
     * apply response row limit
     * @param rowsCount
     * @param offset
     * @returns {Db}
     */
     limit(rowsCount,offset = 0){
         Db.query+=`LIMIT  ${offset}, ${rowsCount}`;
         return this;
     }

    /**
     * execute query method
     * @constructor
     */
    get(){
        const query = Db.query;
        return new Promise((resolve, reject)=>{

            this.connection.connect((err)=>{
                if(err) throw err;
                this.connection.query(query,(err,result)=>{
                    if(err) reject( new Error(err));

                    resolve(result)
                });
            });
            Db.query=``;
        });
    }

    /**
     * execute insert query
     * @param tableName
     * @param fieldsNameWithValue - object with data to insert keys=> fields names; values=> values
     * @returns {Promise<unknown>}
     */
    insert(tableName,fieldsNameWithValue){
        const fieldsNames=Object.keys(fieldsNameWithValue);
        const fieldsValues=Object.values(fieldsNameWithValue).map(element=>{
            return `'${element}'`;
        });

        return new Promise((resolve, reject)=> {
            this.connection.connect((err) => {
                if (err) reject( new Error(err));
                this.connection.query(`INSERT INTO ${tableName} (${fieldsNames.join(', ')}) VALUES (${fieldsValues.join(", ")})`
                    , (err, result) => {
                        if (err) reject( new Error(err));
                        resolve("Success")
                });
            });
        });
    }
}
module.exports = Db;