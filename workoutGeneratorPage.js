async function generateWorkout() {

    const selectedMuscles = [];
    if (document.getElementById("muscle-chest").checked) selectedMuscles.push("chest");
    if (document.getElementById("muscle-back").checked) selectedMuscles.push("back");
    if (document.getElementById("muscle-shoulders").checked) selectedMuscles.push("shoulders");
    if (document.getElementById("muscle-arms").checked) selectedMuscles.push("arms");
    if (document.getElementById("muscle-legs").checked) selectedMuscles.push("legs");
    if (document.getElementById("muscle-core").checked) selectedMuscles.push("core");

    const selectedEquipment = [];
    if (document.getElementById("eq-bodyweight").checked) selectedEquipment.push("Bodyweight");
    if (document.getElementById("eq-barbell").checked) selectedEquipment.push("Barbell");
    if (document.getElementById("eq-dumbbells").checked) selectedEquipment.push("Dumbbells");
    if (document.getElementById("eq-cable").checked) selectedEquipment.push("Cable Machine");
    if (document.getElementById("eq-pullupbar").checked) selectedEquipment.push("Pull-Up Bar");

    const numExercises = parseInt(document.getElementById("num-exercises").value);

    if (selectedMuscles.length === 0) {
        alert("Please select at least one muscle group.");
        return;
    }

    const output = document.getElementById("workout-output");
    output.innerText = "";

    for (let i = 0; i < selectedMuscles.length; i++) {
        const muscle = selectedMuscles[i];

        const res = await fetch(`data/${muscle}.json`);
        const exercises = await res.json();

        const filtered = exercises.filter(exercise => {
            return exercise.equipment.some(eq => selectedEquipment.includes(eq));
        });

        const picked = pickRandom(filtered, numExercises);

        renderGroup(muscle, picked, output);
    }
}

function pickRandom(arr, n) {
    const shuffled = arr.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

function renderGroup(muscle, exercises, output) {
    const groupHeading = document.createElement("h2");
    groupHeading.innerText = muscle.charAt(0).toUpperCase() + muscle.slice(1);
    output.appendChild(groupHeading);

    if (exercises.length === 0) {
        const noResults = document.createElement("p");
        noResults.innerText = "No exercises found for this equipment selection.";
        output.appendChild(noResults);
        return;
    }

    exercises.forEach(exercise => {
        const card = document.createElement("div");
        card.className = "card m-2 p-3";

        const name = document.createElement("h3");
        name.innerText = exercise.name;

        const sets = document.createElement("p");
        sets.innerText = `${exercise.sets} sets of ${exercise.repsMin}–${exercise.repsMax} reps`;

        const equipment = document.createElement("p");
        equipment.innerText = `Equipment: ${exercise.equipment.join(", ")}`;

        card.appendChild(name);
        card.appendChild(sets);
        card.appendChild(equipment);
        output.appendChild(card);
    });
}

document.getElementById("generate-btn").addEventListener("click", generateWorkout);