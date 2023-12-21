const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const port = process.env.PORT || 5000;
const app = express();
const PATH = "uploads/dataset.xlsx";

let probabilityResult;

// local
const { getProbability, getFrequency } = require("./controller/testingData.js");
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
        const probabilityData = [];
        let correctData = 0;
        const totalData = jsonData.length;

        jsonData.forEach((col) => {
            const data = {
                gender: col.A1,
                ageCategory: col.A3,
                hypertension: col.A4,
                smoke: col.A5,
                glucoseCategory: col.A7,
            };
            const result = getProbability(data, jsonData);
            if (result.isDiabetes == col.Kelas) correctData++;
            probabilityData.push(result);
        });

        const allProbability = getFrequency(jsonData);
        const yesTotal = allProbability.diabetesMelitus.ya;
        const noTotal = allProbability.diabetesMelitus.tidak;
        const probabilityColumn = {
            gender: {
                pria: [allProbability.gender.pria[0] / yesTotal, allProbability.gender.pria[1] / noTotal],
                wanita: [allProbability.gender.wanita[0] / yesTotal, allProbability.gender.wanita[1] / noTotal],
            },
            ageCategory: {
                dewasa: [allProbability.ageCategory.dewasa[0] / yesTotal, allProbability.ageCategory.dewasa[1] / noTotal],
                lansia: [allProbability.ageCategory.lansia[0] / yesTotal, allProbability.ageCategory.lansia[1] / noTotal],
                tua: [allProbability.ageCategory.tua[0] / yesTotal, allProbability.ageCategory.tua[1] / noTotal],
            },
            hypertension: {
                ya: [allProbability.hypertension.ya[0] / yesTotal, allProbability.hypertension.ya[1] / noTotal],
                tidak: [allProbability.hypertension.tidak[0] / yesTotal, allProbability.hypertension.tidak[1] / noTotal],
            },
            smoke: {
                ya: [allProbability.smoke.ya[0] / yesTotal, allProbability.smoke.ya[1] / noTotal],
                tidak: [allProbability.smoke.tidak[0] / yesTotal, allProbability.smoke.tidak[1] / noTotal],
            },
            glucoseCategory: {
                normal: [allProbability.glucoseCategory.normal[0] / yesTotal, allProbability.glucoseCategory.normal[1] / noTotal],
                buruk: [allProbability.glucoseCategory.buruk[0] / yesTotal, allProbability.glucoseCategory.buruk[1] / noTotal],
            },
            diabetesMelitus: {
                ya: yesTotal / totalData,
                tidak: noTotal / totalData,
            },
        };

        res.render("index", {
            data: jsonData,
            result: probabilityData,
            correctPercentage: (correctData / totalData) * 100,
            probabilityColumn,
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
