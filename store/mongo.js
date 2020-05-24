const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');

const dbHost = config.mongo.host;
const dbUser = encodeURIComponent(config.mongo.user);
const dbPassword = encodeURIComponent(config.mongo.password);
const dbName = config.mongo.database;

const MONGO_URI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
/**
 * Class that handles the MongoDB connection and exposes the CRUD operations.
 * @class MongoLib
 */
class MongoLib {

  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = dbName;
  }

  /**
   * Creates an instance of MongoLib.
   * @returns {} Object
   * @memberof MongoLib
   */
  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }
          resolve(this.client.db(this.dbName));
        });
      });
    }
    return MongoLib.connection;
  }

  /**
   * Method that list the collection and filtered with a query
   * @param {String} collection Name of the collection
   * @param {{}} query
   * @param {{skip: number, limit: number}} pagination
   * @returns {Promise <{}>}
   * @memberof MongoLib
   */
  list(collection, query, pagination) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).find(query).skip(pagination.skip).limit(pagination.limit)
          .toArray();
      })
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
   * This function retrieves all data found it by query sent.
   *
   * @param {String} collection Name of the collection
   * @param {} query
   * @returns {Promise<[]>}
   */
  search(collection, query) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).find(query).toArray();
      })
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
   * Method that retrieve a document of the collection by uid
   * @param {String} collection Name of the collection
   * @param {String} id
   * @returns {Promise<{}>} Object with the results
   * @memberof MongoLib
   */
  get(collection, id, projection = {}) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).findOne({ _id: ObjectId(id) }, { projection });
      })
      .catch((error) => {
        this.errorMsgHandler(error);
      });
  }

  /**
   * Method that receives a query and return the number of coincidences.
   *
   * @param {String} collection Name of the collection
   * @param {{}} query
   * @returns {Promise<number>}
   * @memberof MongoLib
   */
  findAndCount(collection, query) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).find(query).count();
      })
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
   * Method that return the number of documents in the collection
   *
   * @param {String} collection Name of the collection
   * @returns {Promise<number>}
   * @memberof MongoLib
   */
  countDocuments(collection, query) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).countDocuments(query);
      })
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
   * Method that insert a document in the collection
   * @param {String} collection Name of the collection
   * @param {{}} data
   * @returns {Promise<{insertedId: number, insertedCount: number}>} Object with the results
   * @memberof MongoLib
   */
  insert(collection, data) {
    return this.connect().then((db) => {
      return db.collection(collection).insertOne(data);
    })
      .then((result) => (
        {
          insertedId: result.insertedCount > 0 ? result.insertedId : 0,
          insertedCount: result.insertedCount,
        }))
      .catch((error) => this.errorMsgHandler(error));

  }

  /**
   * Method that update a document of the collection
   * @param {String} collection Name of the collection
   * @param {{}} filter Object with data that will be used to search the document
   * @param {{}} setData Object with data that need to be replace in document
   * @param {{}} pushData Object with data that need to be add in document
   * @param {{}} pullData Object with data that need to be remove from document
   * @returns {Promise<{matchedCount: number, updatedCount: number}>} Object with the results
   * @memberof MongoLib
   */
  update(collection, filter, setData = null, pushData = null, pullData = null, upsert = false) {

    let query = {};

    query = setData !== null || '' ? { ...query, $set: setData } : { ...query };
    query = pushData !== null || '' ? { ...query, $push: pushData } : { ...query };
    query = pullData !== null || '' ? { ...query, $pull: pullData } : { ...query };

    return this.connect().then((db) => {
      return db.collection(collection).updateOne(filter, query, { upsert });
    })
      .then((result) => {
        return {
          matchedCount: result.matchedCount,
          updatedCount: result.modifiedCount,
        };
      })
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
 * Method that delete a document of the collection
 * @param {String} collection Name of the collection
 * @param {String} id
 * @returns {Promise<{}>}
 * @memberof MongoLib
 */
  delete(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).deleteOne({ _id: ObjectId(id) });
    })
      .then((result) => ({
        deletedId: result.deletedCount > 0 ? id : 0,
        deletedCount: result.deletedCount,
      }))
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
   * Method that calculates aggregate values for the data in a collection.
   *
   * @param {String} collection Name of the collection
   * @param Array operation
   * @returns {Promise<{}>}
   * @memberof MongoLib
   */
  aggregate(collection, pipeline) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).aggregate(pipeline).toArray();
      })
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
 * This manage the error that will be show
 *
 * @param error
 */
  errorMsgHandler(error) {
    this._msg = error.errmsg || error;
    throw new Error(this._msg);
  }
}

module.exports = MongoLib;
