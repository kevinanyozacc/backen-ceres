const agricultural_exporter = require("../services/agricultural_exporter"),
  users = require("../services/users");

const get = async (req, res) => {
  let cols = [
    "id",
    "name",
    "contact_person",
    "ruc",
    "department",
    "province",
    "district",
    "address_legal",
    "year",
    "start_date",
    "fech_modi",
    "is_active"
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

  const data = await agricultural_exporter.get(req.params.id, cols);

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

const getCertificates = async (req, res) => {
  let cols = [
      "exporter_id",
      "certificate_id",
      "certificate_state",
      "file_id",
      "inspection_place",
      "importer",
      "destination",
      "transportation_mode",
      "checkpoint",
      "code_plant",
      "inspection_date",
      "export_date",
    ];

  const data = await agricultural_exporter.getCertificates(req.params.id, cols);

  if (!data){
      res.status(500).send({
          message: 'Service error'
      })
      return
  }

  if (data.body.length == 0){
      res.status(200).send({
          message: 'No results',
          data: []
      })
      return
  }

  res.send({
      message: 'Results found',
      total: data.body.data.length,
      data: data.body.data
  });
  return
}

const getCertificatesByFarmID = async (req, res) => {
  let cols = [
      "exporter_id",
      "certificate_id",
      "certificate_state",
      "file_id",
      "inspection_place",
      "importer",
      "destination",
      "transportation_mode",
      "checkpoint",
      "code_plant",
      "inspection_date",
      "export_date",
    ];

  const data = await agricultural_exporter.getCertificatesByFarmID(req.params.id, cols);

  if (!data){
      res.status(500).send({
          message: 'Service error'
      })
      return
  }

  if (data.body.length == 0){
      res.status(200).send({
          message: 'No results',
          data: []
      })
      return
  }

  res.send({
      message: 'Results found',
      total: data.body.data.length,
      data: data.body.data
  });
  return
}

const getCertificatesByPlantID = async (req, res) => {
  let cols = [
      "exporter_id",
      "certificate_id",
      "certificate_state",
      "file_id",
      "inspection_place",
      "importer",
      "destination",
      "transportation_mode",
      "checkpoint",
      "code_plant",
      "inspection_date",
      "export_date",
    ];

  const data = await agricultural_exporter.getCertificatesByPlantID(req.params.id, cols);

  if (!data){
      res.status(500).send({
          message: 'Service error'
      })
      return
  }

  if (data.body.length == 0){
      res.status(200).send({
          message: 'No results',
          data: []
      })
      return
  }

  res.send({
      message: 'Results found',
      total: data.body.data.length,
      data: data.body.data
  });
  return
}

const getOriginCertificates = async (req, res) => {
  let cols = [
      "certificate_id",
      "application_id",
      "camp_exportacion",
      "area",
      "start_date",
    ];

  const data = await agricultural_exporter.getOriginCertificates(req.params.id, cols);

  if (!data){
      res.status(500).send({
          message: 'Service error'
      })
      return
  }

  if (data.body.length == 0){
      res.status(200).send({
          message: 'No results',
          data: []
      })
      return
  }

  res.send({
      message: 'Results found',
      total: data.body.data.length,
      data: data.body.data
  });
  return
}

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
  getCertificates,
  getOriginCertificates,
  getCertificatesByFarmID,
  getCertificatesByPlantID
};
