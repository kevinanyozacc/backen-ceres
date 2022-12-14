const livestock_exporter = require("../services/livestock_exporter"),
  users = require("../services/users");

const get = async (req, res) => {
  cols = [
    "type",
    "id",
    "user_code",
    "name",
    "contact_person",
    "ruc",
    "department",
    "province",
    "district",
    "hq",
    "address_real",
    "line",
    "category",
    "year",
    "start_date",
    "end_date",
    "fech_modi",
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
        "address_legal",
        "dni",
        "phone",
        "mobile_phone");
    }

  data = await livestock_exporter.get(req.params.id, cols);

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
