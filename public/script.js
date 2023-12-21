const filterKriteria = document.getElementById("filter-kriteria");
const inputFilter = document.getElementById("input-filter");
const tableBodyElement = document.querySelector(".table-data");
let oldData;
// filterKriteria.addEventListener("change", (e) => {
//     console.log(e.target.value);
// });

window.addEventListener("load", (e) => {
    oldData = tableBodyElement.innerHTML;
});

inputFilter.addEventListener("input", (e) => {
    const filterCategory = filterKriteria.value;
    const cellClass = document.getElementsByClassName(filterCategory);
    const inputValue = e.target.value;
    const dataFound = [];

    for (let i = 0; i < cellClass.length; i++) {
        const isEqualStr = cellClass[i].textContent.toLowerCase().startsWith(inputValue.toLowerCase());
        if (isEqualStr && inputValue.length) {
            const rowElement = cellClass[i].parentElement;
            const rowData = {
                gender: rowElement.querySelector(".gender").textContent,
                ageCategory: rowElement.querySelector(".ageCategory").textContent,
                hypertension: rowElement.querySelector(".hypertension").textContent,
                smoke: rowElement.querySelector(".smoke").textContent,
                glucoseCategory: rowElement.querySelector(".glucoseCategory").textContent,
                yesProbability: rowElement.querySelector(".probability").firstElementChild.textContent.slice(0, -1),
                noProbability: rowElement.querySelector(".probability").lastElementChild.textContent.slice(0, -1),
                prediction: rowElement.querySelector(".prediction").firstElementChild.textContent,
                diabetesMelitus: rowElement.querySelector(".diabetesMelitus").firstElementChild.textContent,
            };

            dataFound.push(rowData);
        }
    }

    if (dataFound.length > 0) {
        tableBodyElement.innerHTML = "";
        dataFound.forEach((rowData, i) => {
            const statusClass = rowData.diabetesMelitus == "Ya" ? "bg-danger" : "bg-success";
            const predictionClass = rowData.prediction == "Ya" ? "bg-danger" : "bg-success";

            tableBodyElement.innerHTML += `
                <tr>
                    <th scope="row">${i + 1}</th>
                    <td class="gender">${rowData.gender}</td>
                    <td class="ageCategory">${rowData.ageCategory}</td>
                    <td class="hypertension">${rowData.hypertension}</td>
                    <td class="smoke">${rowData.smoke}</td>
                    <td class="glucoseCategory">${rowData.glucoseCategory}</td>
                    <td class="probability">
                        <span class="badge bg-danger">${rowData.yesProbability}%</span> |
                        <span class="badge bg-success">${rowData.noProbability}%</span>
                    </td>

                    <td class="prediction">
                        <span class="badge ${predictionClass}">${rowData.prediction}</span>
                    </td>
                    
                    <td class="diabetesMelitus">
                        <span class="badge ${statusClass}">${rowData.diabetesMelitus}</span>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBodyElement.innerHTML = oldData;
    }
});
