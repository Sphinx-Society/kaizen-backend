
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

      const templateNameExists = await store.findAndCount('catalogs', { 'medicalTests': template.name });

      if (templateNameExists >= 1) {
        return 'Template already exists';
      }
      const insertedAt = Date.now();
      const active = true;

      createdTemplate = {
        ...template,
        active,
        insertedAt,
      };

      const templateInserted = await store.insert(TABLE, createdTemplate);

      if (templateInserted) {
        const catalogInserted = await store.update('catalogs', {}, null, { 'medicalTests': template.name }, null, true);
        if (catalogInserted) {
          return templateInserted;
        }
      }
      return { 'insertedCount': 0 };

    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    insertTemplate,
  };
};
