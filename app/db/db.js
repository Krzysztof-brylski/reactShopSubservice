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
         this.query=lastQuery;
     }

    /**
     * add fields list and table name query
     * @param tableName
     * @param fieldsList
     * @returns {Db}
     * @constructor
     */
     static Select(tableName, fieldsList="*"){
         this.query+=`SELECT ${Array.isArray(tableName) ? fieldsList.join(", ") : fieldsList} FROM ${tableName} `;
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
     where(fieldName, value, operator="*"){
        this.query+=`WHERE ${fieldName} ${operator} '${value}' `;
        return this;
     }

    /**
     * execute query method
     * @constructor
     */
    get(){
        this.query=``;
        this.connection.connect((err)=>{
            if(err) throw err;
            this.connection.query(this.query,(err,result)=>{
                if(err) throw err;
                return result;
            });
        });
    }

}
module.exports = Db;