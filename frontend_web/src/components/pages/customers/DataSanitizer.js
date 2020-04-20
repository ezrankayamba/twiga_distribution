const segments = [
  {
    name: "Customer Information",
    sanitize: (r) => {
      let res = {
        ...r,
        region_id: r.region ? r.region.id : r.region_id,
        district_id: r.district ? r.district.id : r.district_id,
        category_id: r.category ? r.category.id : r.category_id,
      };
      ["region", "district", "category"].forEach((f) => {
        delete res[f];
      });
      return res;
    },
  },
  {
    name: "Customer Contacts",
    sanitize: (params) => {
      let res = params;
      return res;
    },
  },
  {
    name: "Customer Description",
    sanitize: (params) => {
      let res = params;
      return res;
    },
  },
  {
    name: "Brand(s) Supplied",
    sanitize: (info) => {
      let res = info.map((r) => {
        let ret = {
          ...r,
          brand_id: r.brand ? r.brand.id : r.brand_id,
          supplier_id: r.supplier ? r.supplier.id : r.supplier_id,
        };
        ["supplier", "brand"].forEach((f) => {
          delete ret[f];
        });
        return ret;
      });

      return res;
    },
  },
];

const DataSanitizer = {
  sanitize: (formData) => {
    let data = {};
    segments.forEach((s) => {
      let info = formData[s.name];
      data[s.name] = s.sanitize(info);
    });
    return data;
  },
};

export default DataSanitizer;
