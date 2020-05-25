const objectIdHandler = require('../shared/handlers/objectIdHandler');
const updateObjectHandler = require('../shared/handlers/updateObjectHandler');
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

      createdTemplate = {
        ...template,
        active: true,
        insertedAt: Date.now(),
      };

      const templateInserted = await store.insert(TABLE, createdTemplate);
      return templateInserted;

    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Function that updates a template
   *
   * @param {String} templateId
   * @param {{}} templateData Object with the data to replace
   * @returns {{"matchedCount": number, "updatedCount": number}} Update count
   */
  async function updateTemplate(templateId, templateData) {

    try {
      const id = objectIdHandler(templateId);
      const updateTemplate = updateObjectHandler(templateData);

      //TODO Add createdby from jwt
      const updatedCount = await store.update(TABLE, id, updateTemplate);
      return updatedCount;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Function that deletes a template
   *
   * @param {String} userId
   * @returns {Promise <{ "matchedCount": number, "updatedCount": number}>}
   */
  async function deleteTemplate(userId) {

    try {
      const updatedAt = Date.now();
      const id = objectIdHandler(userId);
      const deletedCount = await store.update(TABLE, id,
        { 'active': false, updatedAt });
      return deletedCount;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Retrieves the data about template searched by id
   * @param { String } templateId
   * @return {Promise<*>}
   */
  async function getTemplateById(templateId) {
    try {
      const id = objectIdHandler(templateId);
      const query = { ...id, active: true };
      return await store.search(TABLE, query);
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    insertTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
  };
};
