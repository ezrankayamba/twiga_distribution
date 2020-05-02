const ObjectUtils = {
  onlyWithValues: (obj) => {
    return Object.entries(obj).reduce(
      (a, [k, v]) => (v ? { ...a, [k]: v } : a),
      {}
    );
  },
};
export default ObjectUtils;
