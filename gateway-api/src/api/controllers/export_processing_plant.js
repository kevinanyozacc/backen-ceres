const export_processing_plant = require("../services/export_processing_plant"),
  users = require("../services/users");

const get = async (req, res) => {
  cols = [
    "id",
    "name",
    "contact_person",
    "sequential_id",
    "application_id",
    "file_id",
    "geo_lat",
    "geo_long",
    "zone",
    "department",
    "province",
    "district",
    "address_real",
    "year",
    "start_date",
    "fech_modi",
    "is_active",
    "category",
    "state"
  ];

  if (req.decoded) {
    if (!req.decoded.id) {
      res.status(400).send({
        message: "ID is mandatory",
      });
      return;
    }

    // if (!(await checkStatus(req.decoded.id))) {
    //   res.status(400).send({
    //     message: "You are logged out",
    //   });
    //   return;
    // }
    cols.push(
        "contact_person_dni",
        "contact_person_phone",
        "contact_person_mobile_phone");
    }

  data = await export_processing_plant.get(req.params.id, cols);

  if (!data) {
    res.status(500).send({
      message: "Service error",
    });
    return;
  }

  if (data.body.length == 0) {
    res.status(200).send({
      message: "No results",
      data: [],
    });
    return;
  }

  res.send({
    message: "Results found",
    data: data.body.data,
  });
  return;
};

const checkStatus = async (id) => {
  status = await users.getOne(id, "status");

  if (!status) {
    return false;
  }

  if (status != "1") {
    return false;
  }

  return true;
};

module.exports = {
  get,
};
