module.exports = function prefixHandler(prefix, data) {
  return Object.keys(data).reduce((acc, item) => {
    const property = `${prefix}.$.${item}`;
    acc[property] = data[item];
    return acc;
  }, {});
};
