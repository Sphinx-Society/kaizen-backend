const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Encapsulates the testing DB setup using mongodb-memory-server library
 *
 * @class DBManager
 */
class DBManager {
  constructor() {
    this.db = null;
    this.server = new MongoMemoryServer();
    this.connection = null;
  }

  /**
   * Start a new in-memory mongo instance
   *
   * @memberof DBManager
   */
  async start() {
    const url = await this.server.getConnectionString();
    this.connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.connection.db(await this.server.getDbName());
  }

  /**
   * Close the connection and halt the mongo instance
   *
   * @returns boolean
   * @memberof DBManager
   */
  stop() {
    this.connection.close();
    return this.server.stop();
  }
}

module.exports = DBManager;
