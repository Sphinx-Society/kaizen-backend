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
   * @param {*} collection
   * @param {*} query
   * @returns Object
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
   * @param collection
   * @param query
   * @returns {Promise<unknown>}
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
   * @param {*} collection
   * @param {*} id
   * @returns Object
   * @memberof MongoLib
   */
  get(collection, id, projection = {}) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).findOne({ _id: ObjectId(id) }, { projection });
      })
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
   * Method that receives a query and return the number of coincidences.
   *
   * @param {*} collection
   * @param {*} query
   * @returns Number
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
   * @param {*} collection
   * @returns
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
   * @param {*} collection
   * @param {*} data
   * @returns Object
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
   * @param {*} collection
   * @param {*} id
   * @param {*} data
   * @returns Object
   * @memberof MongoLib
   */
  update(collection, id, setData, pushData = '') {

    let query = {};

    query = setData !== (undefined || null || '') ? { ...query, $set: setData } : { ...query };
    query = pushData !== (undefined || null || '') ? { ...query, $push: pushData } : { ...query };

    return this.connect().then((db) => {
      return db.collection(collection).updateOne({ _id: ObjectId(id) }, query, { upsert: false });
    })
      .then((result) => (
        {
          updatedId: result.modifiedCount > 0 ? id : 0,
          updatedCount: result.modifiedCount,
        }))
      .catch((error) => this.errorMsgHandler(error));
  }

  /**
 * Method that delete a document of the collection
 * @param {*} collection
 * @param {*} id
 * @returns Object
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
 * This manage the error that will be show
 *
 * @param error
 */
  errorMsgHandler(error) {
    console.log('search error: ', error);
    this._msg = error.errmsg || error;
    throw new Error(this._msg);
  }
}

module.exports = MongoLib;
