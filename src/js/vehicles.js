
let vehicleId = 0;     // идентификатор Vehicle, который редактируется
const vehicleForm = document.forms["vehicleForm"];    // форма ввода
console.log(">>> FORM <<<", vehicleForm)
const bearer = sessionStorage.getItem("bearer");
const domainUrl = "http://localhost:8001";
const defaultQueryParams = "?page=0&size=100"
console.log(">>> FORM <<<", bearer)
// Получение всех пользователей
async function getVehicles() {
    // отправляет запрос и получаем ответ
    const response = await fetch(domainUrl + "/vehicle/vehicles/" + defaultQueryParams, {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${bearer}` }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const responseData = await response.json();
        const vehicles = responseData.results
        const rows = document.querySelector("tbody"); 
        // добавляем полученные элементы в таблицу
        vehicles.forEach(vehicle => rows.append(row(vehicle)));
    }
}
// Получение одного Vehicle
async function getVehicle(id) {
    const response = await fetch(domainUrl + "/vehicle/vehicles/" + id  + defaultQueryParams, {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${bearer}` }
    });
    if (response.ok === true) {
        const vehicle = await response.json();
        vehicleId = vehicle.id;
        vehicleForm.elements["readID"].value = vehicle.id;
        vehicleForm.elements["inputBrandmodel"].value = vehicle.brandmodel_id;
        vehicleForm.elements["inputCost"].value = vehicle.cost;
        vehicleForm.elements["inputManufacturedYear"].value = vehicle.manufactured_year;
        vehicleForm.elements["isInWork"].checked = (vehicle.is_in_work === true ? true : false);
        vehicleForm.elements["inputDescription"].value = vehicle.description;
        vehicleForm.elements["inputEnterpriseId"].value = vehicle.enterprise_id;
        vehicleForm.elements["readCreatedAt"].value = vehicle.created_at;
        vehicleForm.elements["inputMileage"].value = vehicle.mileage;
    }
}
// Добавление Vehicle
async function createVehicle(
    brandmodel_id,
    cost,
    manufactured_year,
    description,
    mileage,
    is_in_work,
    enterprise_id = null,
) {
    const requestBody = {
        brandmodel_id: parseInt(brandmodel_id),
        description: description,
        cost: parseInt(cost),
        manufactured_year: parseInt(manufactured_year),
        mileage: parseInt(mileage),
        is_in_work: Boolean(is_in_work),
        enterprise_id: parseInt(enterprise_id)
    };
    const response = await fetch(domainUrl + "/vehicle/vehicles/", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${bearer}`
        },
        body: JSON.stringify(requestBody)
    });
    if (response.ok === true) {
        const vehilcle = await response.json();
        reset();
        document.querySelector("tbody").append(row(vehilcle));
    }
}
// Изменение Vehicle
async function editVehicle(
    id,
    brandmodel_id = null,
    cost = null,
    manufactured_year = null,
    description = null,
    mileage = null,
    enterprise_id = null,
    is_in_work = null
) {
    const response = await fetch(domainUrl + "/vehicle/vehicles/" + id  + defaultQueryParams, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${bearer}`
        },
        body: JSON.stringify({
            brandmodel_id: brandmodel_id,
            description: description,
            cost: cost,
            manufactured_year: manufactured_year,
            mileage: mileage,
            is_in_work: Boolean(is_in_work),
            enterprise_id: enterprise_id
        })
    });
    if (response.ok === true) {
        const vehicle = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + vehicle.id + "']").replaceWith(row(vehicle));
    }
}
// Удаление пользователя
async function deleteVehicle(id) {
    const response = await fetch(domainUrl + "/vehicle/vehicles/" + id  + defaultQueryParams, {
        method: "DELETE",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${bearer}` }
    });
    if (response.ok === true) {
        const vehicle = await response.json();
        document.querySelector("tr[data-rowid='" + vehicle.id + "']").remove();
    }
}

// сброс формы и текущего идентификатора пользователя
function reset() {
    vehicleForm.reset();
    vehicleId = 0;
}
// создание строки для таблицы
function row(vehicle) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", vehicle.id);

    const idTd = document.createElement("td");
    idTd.append(vehicle.id);
    tr.append(idTd);

    const brandmodelTd = document.createElement("td");
    brandmodelTd.append(vehicle.brandmodel_id);
    tr.append(brandmodelTd);

    const descriptionTd = document.createElement("td");
    descriptionTd.append(vehicle.description);
    tr.append(descriptionTd);

    const mileageTd = document.createElement("td");
    mileageTd.append(vehicle.mileage);
    tr.append(mileageTd);

    const costTd = document.createElement("td");
    costTd.append(vehicle.cost);
    tr.append(costTd);

    const isInWorkTd = document.createElement("td");
    isInWorkTd.append(vehicle.is_in_work);
    tr.append(isInWorkTd);

    const manufacturedTd = document.createElement("td");
    manufacturedTd.append(vehicle.manufactured_year);
    tr.append(manufacturedTd);

    const enterpriseTd = document.createElement("td");
    enterpriseTd.append(vehicle.enterprise_id === null ? "" : vehicle.enterprise_id);
    tr.append(enterpriseTd);

    const createdAtTd = document.createElement("td");
    createdAtTd.append(vehicle.created_at);
    tr.append(createdAtTd);
        
    const linksTd = document.createElement("td");

    const editLink = document.createElement("button");
    editLink.setAttribute("data-id", vehicle.id);
    editLink.setAttribute("type", "submit");
    editLink.setAttribute("class", "btn btn-primary");
    editLink.setAttribute("style", "margin-right: 5px;");
    editLink.append("Update");
    editLink.addEventListener("click", async e => {

        e.preventDefault();
        await getVehicle(vehicle.id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("button");
    removeLink.setAttribute("data-id", vehicle.id);
    removeLink.setAttribute("type", "submit");
    removeLink.setAttribute("class", "btn btn-danger");
    removeLink.setAttribute("style", "margin-left: 5px;");
    removeLink.append("Delete");
    removeLink.addEventListener("click", async e => {

        e.preventDefault();
        await deleteVehicle(vehicle.id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// delete vehicle from the form
const deleteButtonObject = document.getElementById("deleteButton");
deleteButtonObject.addEventListener("click", e => {
    if (vehicleId !== 0) deleteVehicle(vehicleId);
});

// сброс значений формы
vehicleForm.addEventListener("reset", e => reset());

// отправка формы
vehicleForm.addEventListener("submit", e => {
    e.preventDefault();

    const brandmodel_id = vehicleForm.elements["inputBrandmodel"].value;
    const cost = vehicleForm.elements["inputCost"].value;
    const manufactured_year = vehicleForm.elements["inputManufacturedYear"].value;
    const is_in_work = vehicleForm.elements["isInWork"].checked;
    const description = vehicleForm.elements["inputDescription"].value;
    const enterprise_id = vehicleForm.elements["inputEnterpriseId"].value;
    const mileage = vehicleForm.elements["inputMileage"].value;
    if (vehicleId === 0) createVehicle(
        brandmodel_id,
        cost,
        manufactured_year,
        description,
        mileage,
        enterprise_id,
        is_in_work
    );
    else editVehicle(
        vehicleId,
        brandmodel_id,
        cost,
        manufactured_year,
        description,
        mileage,
        enterprise_id,
        is_in_work
    );
});

// загрузка пользователей
// getVehicles();