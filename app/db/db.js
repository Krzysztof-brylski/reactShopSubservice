const mysql = require('mysql');
require('dotenv').config();
/**
 * simple db driver
 */
class Db {
    static queryString='';
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
         Db.queryString =lastQuery;
     }

    /**
     * add fields list and table name query
     * @param tableName
     * @param fieldsList
     * @returns {Db}
     * @constructor
     */
     static select(tableName, fieldsList="*"){
         Db.queryString+=`SELECT ${Array.isArray(tableName) ? fieldsList.join(", ") : fieldsList} FROM ${tableName} `;
         return new Db(null,null,null,null,Db.queryString);
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
        Db.queryString+=`WHERE ${fieldName} ${operator} '${value}' `;
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
        Db.queryString+=`AND ${fieldName} ${operator} '${value}' `;
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
        Db.queryString+=`OR ${fieldName} ${operator} '${value}' `;
        return this;
     }


    /**
     * apply response row limit
     * @param rowsCount
     * @param offset
     * @returns {Db}
     */
     limit(rowsCount,offset = 0){
         Db.queryString+=`LIMIT  ${offset}, ${rowsCount}`;
         return this;
     }

    /**
     * run query
     * @constructor
     */
    get(){
        const queryString = Db.queryString;
        return new Promise((resolve, reject)=>{

            this.connection.connect((err)=>{
                if(err) throw err;
                this.connection.query(queryString,(err,result)=>{
                    if(err) reject( new Error(err));

                    resolve(result)
                });
            });
            Db.queryString=``;
        });
    }

    /**
     * add insert into to query
     * @param tableName
     * @param fieldsNameWithValue - object with data to insert keys=> fields names; values=> values
     * @returns {Db}
     */
    static insert(tableName,fieldsNameWithValue){

        let fieldsNames=Object.keys(fieldsNameWithValue);
        let fieldsValues=Object.values(fieldsNameWithValue).map(element=>{
            return `'${element}'`;
        });
        return new Db(null,
            null,
            null,
            null,
            `INSERT INTO ${tableName} (${fieldsNames.join(', ')}) VALUES (${fieldsValues.join(", ")})`
        );
    }

    /**
     * add update to query
     * @param tableName
     * @param fieldsNameWithValue
     * @returns {Db}
     */
    static update(tableName,fieldsNameWithValue){
        var updateData="";
        Object.keys(fieldsNameWithValue).map((element)=>{
            updateData += `${element} = '${fieldsNameWithValue[element]}' `;
        });

        return new Db(null,
            null,
            null,
            null,
            `UPDATE ${tableName} SET ${updateData}`
        );
    }

}
module.exports = Db;