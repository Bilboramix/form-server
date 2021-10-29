const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

const app = express();
app.use(formidable());
app.use(cors());

app.post("/form", (req, res) => {
  try {
    const data = {
      from: `${req.fields.firstname} ${req.fields.lastname} ${req.fields.email}`,
      to: String(process.env.MY_MAIL),
      subject: `${req.fields.subject}`,
      text: `${req.fields.message}`,
    };
    mg.messages().send(data, (error, body) => {
      res.json(body);
      if (error) {
        res.json({ error: error });
      }
    });
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
});

app.listen(process.env.PORT, () => {
  console.log("server ON");
});
