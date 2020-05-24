
/**
 * Controller that validate the request information and sends it to the store
 * @param  {} injectedStore
 * @param  {} TABLE
 * @returns {} CRUD functions
 */
module.exports = function (InjectedStore, TABLE) {
  const store = new InjectedStore();

  /**
   * Function that insert a template in database
   * @param {{}} template
   * @returns {{templateInserted: {})}}
   */

  async function insertTemplate(template) {

    try {

      const insertedAt = Date.now();
      const active = true;

      createdTemplate = {
        ...template,
        active,
        insertedAt,
      };

      const templateInserted = await store.insert(TABLE, createdTemplate);

      return templateInserted;

    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    insertTemplate,
  };
};
