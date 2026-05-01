const FAVORITES_KEY = "favoriteExercises";

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

function mergeUniqueById(arr1, arr2) {
    const seen = new Map();
    arr1.concat(arr2).forEach(item => {
        if (!seen.has(item.id)) {
            seen.set(item.id, item);
        }
    });
    return Array.from(seen.values());
}

function isFavorite(muscle, id) {
    return getFavoriteRefs().some(item => item.muscle === muscle && item.id === id);
}

function addFavoriteRef(muscle, id) {
    const favorites = getFavoriteRefs();
    if (!favorites.some(item => item.muscle === muscle && item.id === id)) {
        favorites.push({ muscle, id });
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

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
    const includeFavorites = document.getElementById("include-favorites").checked;
    const favoriteRefs = includeFavorites ? getFavoriteRefs() : [];

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

        let candidates = filtered;
        if (includeFavorites) {
            const favoriteIds = favoriteRefs
                .filter(ref => ref.muscle === muscle)
                .map(ref => ref.id);

            if (favoriteIds.length > 0) {
                const favoriteCandidates = exercises.filter(exercise => {
                    return favoriteIds.includes(exercise.id) && exercise.equipment.some(eq => selectedEquipment.includes(eq));
                });
                candidates = mergeUniqueById(filtered, favoriteCandidates);
            }
        }

        const picked = pickRandom(candidates, numExercises);

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

        const favoriteButton = document.createElement("button");
        favoriteButton.type = "button";
        favoriteButton.className = "btn btn-outline-secondary btn-sm";
        favoriteButton.innerText = isFavorite(muscle, exercise.id) ? "Already in Favorites" : "Add to Favorite";
        favoriteButton.disabled = isFavorite(muscle, exercise.id);
        favoriteButton.addEventListener("click", () => {
            addFavoriteRef(muscle, exercise.id);
            favoriteButton.innerText = "Added to Favorites";
            favoriteButton.className = "btn btn-success btn-sm";
            favoriteButton.disabled = true;
        });

        card.appendChild(name);
        card.appendChild(sets);
        card.appendChild(equipment);
        card.appendChild(favoriteButton);
        output.appendChild(card);
    });
}

document.getElementById("generate-btn").addEventListener("click", generateWorkout);