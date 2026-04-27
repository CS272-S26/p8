let allExercises = [];

fetch("data/core.json")
    .then(res => res.json())
    .then(exercises => {
        allExercises = exercises;
        renderCards(allExercises);
    })
    .catch(err => console.error("Fetch failed:", err));

function renderCards(exercises) {
    const list = document.getElementById("core-list");
    list.innerText = "";
    exercises.forEach(e => appendExerciseComponent(e));
}

function appendExerciseComponent(coreData) {
    const newColDivNode = document.createElement("div");
    newColDivNode.id = `core-${coreData.id}`;
    newColDivNode.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

    const newCardDivNode = document.createElement("div");
    newCardDivNode.className = "card m-2 p-2";

    newCardDivNode.addEventListener("click", () => {
        window.location.href = `exercisePage.html?muscle=core&id=${coreData.id}`;
    });

    const newTitleNode = document.createElement("h2");
    newTitleNode.innerText = coreData.name;

    const newImgNode = document.createElement("img");
    newImgNode.src = coreData.pictureUrl;
    newImgNode.alt = coreData.name + " picture";
    newImgNode.style.height = "200px";
    newImgNode.style.objectFit = "cover";

    const wrapper = document.createElement("div");
    wrapper.className = "exercise-card";
    wrapper.appendChild(newImgNode);

    const newDescNode = document.createElement("p");
    newDescNode.innerText = coreData.instructions.slice(0, 100);

    newCardDivNode.appendChild(wrapper);
    newCardDivNode.appendChild(newTitleNode);
    newCardDivNode.appendChild(newDescNode);
    newColDivNode.appendChild(newCardDivNode);
    document.getElementById("core-list").appendChild(newColDivNode);
}

document.getElementById("filter-bodyweight").addEventListener("change", filterExercises);
document.getElementById("filter-pullupbar").addEventListener("change", filterExercises);

function filterExercises() {
    const selectedEquipment = [];
    if (document.getElementById("filter-bodyweight").checked) selectedEquipment.push("Bodyweight");
    if (document.getElementById("filter-pullupbar").checked) selectedEquipment.push("Pull-Up Bar");

    if (selectedEquipment.length === 0) {
        renderCards(allExercises);
        return;
    }

    const filtered = allExercises.filter(exercise => {
        return exercise.equipment.some(eq => selectedEquipment.includes(eq));
    });

    renderCards(filtered);
}