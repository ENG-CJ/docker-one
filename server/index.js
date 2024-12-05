const express = require("express");
const Joi = require("joi");
const somaliaData = require("./somalia-data");
const presidents = require("./presidents");
const path = require("path");   
const cors = require("cors");   


const app = express();
const PORT = 7200;
app.use(cors())
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/api/presidents", (req, res) => {
  res.json(presidents);
});

app.get("/api/presidents/:type/:name", (req, res) => {
  if (Object.keys(presidents).includes(req.params.type)) {
    
    if(req.params.type.toLowerCase()==Object.keys(presidents)[0]){
        var data_1 = presidents.federal

        return res.json({ response: data_1 });
    }
    const data = presidents.states.filter(state=> state.president.toLowerCase().trim()==req.params.name.toLowerCase().trim())
    return res.json({response: data})
  }
  return res.json({response : "Unknown  Pattern " + req.params.type});
});



// Route to fetch all states
app.get("/api/states", (req, res) => {
  res.json(somaliaData.states);
});

// Route to fetch regions of a specific state
app.get("/api/regions/:state", (req, res) => {
  const stateName = req.params.state;
  const state = somaliaData.states.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );

  if (!state) {
    return res.status(404).json({ message: "State not found" });
  }

  res.json(state.regions);
});

// Route to fetch districts of a specific region
app.get("/api/districts/:region", (req, res) => {
  const regionName = req.params.region;
  const region = somaliaData.states
    .flatMap((s) => s.regions)
    .find((r) => r.name.toLowerCase() === regionName.toLowerCase());

  if (!region) {
    return res.status(404).json({ message: "Region not found" });
  }

  res.json(region.districts);
});

// POST route to add a new state (with validation using Joi)
app.post("/api/states", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    capital: Joi.string().required(),
    regions: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        districts: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            type: Joi.string().valid("City", "Town").required(),
          })
        ),
      })
    ),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  somaliaData.states.push(req.body);
  res
    .status(201)
    .json({ message: "State added successfully", state: req.body });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
