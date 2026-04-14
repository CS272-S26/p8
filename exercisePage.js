const exerciseContainer = document.getElementById("exercise-detail")

const params = new URLSearchParams(window.location.search);
const muscle = params.get("muscle");
const id = params.get("id");

fetch(`data/${muscle}.json`)
    .then(res => res.json())
    .then(exercises => {
        const exercise = exercises.find(e => e.id === id);
        if (!exercise) {
            const msg = document.createElement("p");
            msg.innerText = "Exercise not found.";
            exerciseContainer.appendChild(msg);
            return;
        }
        renderExercise(exercise);
    })
    .catch(err => console.error(err));

function renderExercise(exercise) {
    const title = document.createElement("h1");
    title.innerText = exercise.name;

    const instructions = document.createElement("p");
    instructions.innerText = exercise.instructions;

    const setsHeader = document.createElement("h2");
    setsHeader.innerText = "Sets & Reps";

    const sets = document.createElement("p");
    sets.innerText = `${exercise.sets} sets of ${exercise.repsMin}–${exercise.repsMax} reps`;

    const equipmentHeader = document.createElement("h2");
    equipmentHeader.innerText = "Equipment";

    const equipment = document.createElement("p");
    equipment.innerText = exercise.equipment.join(", ");

    const primaryMuscleHeader = document.createElement("h2");
    primaryMuscleHeader.innerText = "Primary Muscles";

    const primaryMuscle = document.createElement("p");
    primary.innerText = exercise.primaryMuscles.join(", ");

    const secondaryMuscleHeader = document.createElement("h2");
    secondaryMuscleHeader.innerText = "Secondary Muscles";

    const secondaryMuscle = document.createElement("p");
    secondaryMuscle.innerText = exercise.secondaryMuscles.join(", ");

    exerciseContainer.appendChild(title);
    exerciseContainer.appendChild(instructions);
    exerciseContainer.appendChild(setsHeader);
    exerciseContainer.appendChild(sets);
    exerciseContainer.appendChild(equipmentHeader);
    exerciseContainer.appendChild(equipment);
    exerciseContainer.appendChild(primaryMuscleHeader);
    exerciseContainer.appendChild(primaryMuscle);
    exerciseContainer.appendChild(secondaryMuscleHeader);
    exerciseContainer.appendChild(secondaryMuscle);
}