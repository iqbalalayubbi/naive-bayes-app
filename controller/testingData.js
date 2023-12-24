const { getAllData } = require("./getAllData");

function getTotalData(allData = Array) {
    return allData.length;
}

function getFrequency(allData = Array) {
    // calculate how many gender yes and no (diabetes)
    const gender = {
        pria: [0, 0], // [ya, no]
        wanita: [0, 0],
    };

    const ageCategory = {
        dewasa: [0, 0],
        tua: [0, 0],
        lansia: [0, 0],
    };

    const hypertension = {
        ya: [0, 0],
        tidak: [0, 0],
    };

    const smoke = {
        ya: [0, 0],
        tidak: [0, 0],
    };

    const glucoseCategory = {
        normal: [0, 0],
        buruk: [0, 0],
    };

    const diabetesMelitus = {
        ya: 0,
        tidak: 0,
    };

    allData.forEach((col) => {
        if (col.A1 == "Pria") {
            if (col.Kelas == "Ya") gender.pria[0]++;
            else gender.pria[1]++;
        } else {
            if (col.Kelas == "Ya") gender.wanita[0]++;
            else gender.wanita[1]++;
        }

        if (col.A3 == "Dewasa") {
            if (col.Kelas == "Ya") ageCategory.dewasa[0]++;
            else ageCategory.dewasa[1]++;
        } else if (col.A3 == "Tua") {
            if (col.Kelas == "Ya") ageCategory.tua[0]++;
            else ageCategory.tua[1]++;
        } else {
            if (col.Kelas == "Ya") ageCategory.lansia[0]++;
            else ageCategory.lansia[1]++;
        }

        if (col.A4 == "Ya") {
            if (col.Kelas == "Ya") hypertension.ya[0]++;
            else hypertension.ya[1]++;
        } else {
            if (col.Kelas == "Ya") hypertension.tidak[0]++;
            else hypertension.tidak[1]++;
        }

        if (col.A5 == "Ya") {
            if (col.Kelas == "Ya") smoke.ya[0]++;
            else smoke.ya[1]++;
        } else {
            if (col.Kelas == "Ya") smoke.tidak[0]++;
            else smoke.tidak[1]++;
        }

        if (col.A7 == "Normal") {
            if (col.Kelas == "Ya") glucoseCategory.normal[0]++;
            else glucoseCategory.normal[1]++;
        } else {
            if (col.Kelas == "Ya") glucoseCategory.buruk[0]++;
            else glucoseCategory.buruk[1]++;
        }

        if (col.Kelas == "Ya") diabetesMelitus.ya++;
        else diabetesMelitus.tidak++;
    });

    return { gender, ageCategory, hypertension, smoke, glucoseCategory, diabetesMelitus };
}

function getProbability(data = Object, allData = Array) {
    // console.log(data);

    const dataFrequency = getFrequency(allData);

    let noProbability = 1;
    let yesProbability = 1;

    for (const key in data) {
        if (key == "gender") {
            yesProbability *= dataFrequency.gender[data[key].toLowerCase()][0] / dataFrequency.diabetesMelitus.ya;
            noProbability *= dataFrequency.gender[data[key].toLowerCase()][1] / dataFrequency.diabetesMelitus.tidak;
        } else if (key == "ageCategory") {
            yesProbability *= dataFrequency.ageCategory[data[key].toLowerCase()][0] / dataFrequency.diabetesMelitus.ya;
            noProbability *= dataFrequency.ageCategory[data[key].toLowerCase()][1] / dataFrequency.diabetesMelitus.tidak;
        } else if (key == "hypertension") {
            yesProbability *= dataFrequency.hypertension[data[key].toLowerCase()][0] / dataFrequency.diabetesMelitus.ya;
            noProbability *= dataFrequency.hypertension[data[key].toLowerCase()][1] / dataFrequency.diabetesMelitus.tidak;
        } else if (key == "smoke") {
            yesProbability *= dataFrequency.smoke[data[key].toLowerCase()][0] / dataFrequency.diabetesMelitus.ya;
            noProbability *= dataFrequency.smoke[data[key].toLowerCase()][1] / dataFrequency.diabetesMelitus.tidak;
        } else {
            yesProbability *= dataFrequency.glucoseCategory[data[key].toLowerCase()][0] / dataFrequency.diabetesMelitus.ya;
            noProbability *= dataFrequency.glucoseCategory[data[key].toLowerCase()][1] / dataFrequency.diabetesMelitus.tidak;
        }
    }

    const totalData = getTotalData(allData);
    noProbability *= dataFrequency.diabetesMelitus.tidak / totalData;
    yesProbability *= dataFrequency.diabetesMelitus.ya / totalData;

    const probabilityData = {
        yesProbability: yesProbability.toFixed(5),
        noProbability: noProbability.toFixed(5),
        isDiabetes: yesProbability > noProbability ? "Ya" : "Tidak",
    };
    return probabilityData;
}

module.exports = { getProbability, getFrequency };
