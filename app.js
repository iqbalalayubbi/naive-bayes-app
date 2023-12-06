const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const port = process.env.PORT || 5000;
const app = express();
const PATH = "uploads/dataset.xlsx";

let probabilityResult;

// local
const { getProbability } = require("./controller/testingData.js");
const { getAllData } = require("./controller/getAllData.js");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        // create filename
        // cb(null, Date.now() + "-" + file.originalname);
        cb(null, "dataset.xlsx");
    },
});

const upload = multer({ storage: storage });

const uploadXLSX = async (req, res, next) => {
    console.log("upload file");
    try {
        const jsonData = getAllData(PATH);
        if (jsonData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "xml sheet has no data",
            });
        }
        res.redirect("/");
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

app.post("/upload", upload.single("xlsx"), uploadXLSX);

app.get("/", (req, res) => {
    try {
        const jsonData = getAllData(PATH);
        res.render("index", {
            data: jsonData,
        });
    } catch (error) {
        res.render("index", {
            data: "",
        });
    }
});

app.get("/add", (req, res) => {
    res.render("addData");
});

app.get("/test", (req, res) => {
    res.render("testData", { result: "" });
});

app.post("/test", (req, res) => {
    const data = req.body;
    const jsonData = getAllData(PATH);
    res.render("testData", { result: getProbability(data, jsonData) });
});

app.post("/add", (req, res) => {
    res.json(req.body);
});

app.listen(port, () => {
    console.log("app running on port", port);
});
