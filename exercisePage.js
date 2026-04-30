const FAVORITES_KEY = "favoriteExercises";
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

function getFavoriteRefs() {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error("Failed to parse favorites from localStorage", err);
        return [];
    }
}

function saveFavoriteRefs(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(muscle, id) {
    return getFavoriteRefs().some(item => item.muscle === muscle && item.id === id);
}

function toggleFavorite(muscle, id) {
    const favorites = getFavoriteRefs();
    const index = favorites.findIndex(item => item.muscle === muscle && item.id === id);
    if (index >= 0) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ muscle, id });
    }
    saveFavoriteRefs(favorites);
}

function renderExercise(exercise) {
    const title = document.createElement("h1");
    title.innerText = exercise.name;

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "btn btn-outline-primary mb-3";

    function updateFavoriteButton() {
        if (isFavorite(muscle, exercise.id)) {
            favoriteButton.innerHTML = `<i class="bi bi-star-fill"></i> Remove from Favorites`;
            favoriteButton.className = "btn btn-warning mb-3";
        } else {
            favoriteButton.innerHTML = `<i class="bi bi-star"></i> Add to Favorites`;
            favoriteButton.className = "btn btn-outline-primary mb-3";
        }
    }

    favoriteButton.addEventListener("click", () => {
        toggleFavorite(muscle, exercise.id);
        updateFavoriteButton();
    });

    updateFavoriteButton();

    const newImgNode = document.createElement("img");
    newImgNode.src = exercise.pictureUrl; 
    newImgNode.alt = exercise.name;
    newImgNode.style.height = "300px";
    newImgNode.style.objectFit = "cover";

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
    primaryMuscle.innerText = exercise.primaryMuscles.join(", ");

    const secondaryMuscleHeader = document.createElement("h2");
    secondaryMuscleHeader.innerText = "Secondary Muscles";

    const secondaryMuscle = document.createElement("p");
    secondaryMuscle.innerText = exercise.secondaryMuscles.join(", ");

    exerciseContainer.appendChild(title);
    exerciseContainer.appendChild(favoriteButton);
    exerciseContainer.appendChild(newImgNode);
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