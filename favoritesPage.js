const FAVORITES_KEY = "favoriteExercises";
const favoritesList = document.getElementById("favorites-list");
const favoritesEmpty = document.getElementById("favorites-empty");

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

function removeFavoriteRef(muscle, id) {
    const favorites = getFavoriteRefs().filter(item => !(item.muscle === muscle && item.id === id));
    saveFavoriteRefs(favorites);
    return favorites;
}

function showEmpty(message) {
    favoritesList.innerHTML = "";
    favoritesEmpty.innerText = message;
    favoritesEmpty.style.display = "block";
}

function renderFavoriteCard(muscle, exercise) {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "col-12 col-md-6 col-lg-4 mb-3";

    const card = document.createElement("div");
    card.className = "card h-100";

    const img = document.createElement("img");
    img.src = exercise.pictureUrl;
    img.alt = exercise.name;
    img.className = "card-img-top";
    img.style.height = "200px";
    img.style.objectFit = "cover";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.innerText = exercise.name;

    const muscleTag = document.createElement("p");
    muscleTag.className = "text-muted mb-2";
    muscleTag.innerText = `${muscle.charAt(0).toUpperCase() + muscle.slice(1)} muscle group`;

    const equipment = document.createElement("p");
    equipment.className = "mb-3";
    equipment.innerText = `Equipment: ${exercise.equipment.join(", ")}`;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "mt-auto d-flex gap-2";

    const viewButton = document.createElement("a");
    viewButton.href = `exercisePage.html?muscle=${muscle}&id=${exercise.id}`;
    viewButton.className = "btn btn-dark btn-sm flex-fill";
    viewButton.innerText = "View";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-outline-danger btn-sm flex-fill";
    removeButton.innerText = "Remove";
    removeButton.addEventListener("click", () => {
        const remaining = removeFavoriteRef(muscle, exercise.id);
        cardWrapper.remove();
        if (remaining.length === 0) {
            showEmpty("You have no favorite exercises yet.");
        }
    });

    buttonGroup.appendChild(viewButton);
    buttonGroup.appendChild(removeButton);
    cardBody.appendChild(title);
    cardBody.appendChild(muscleTag);
    cardBody.appendChild(equipment);
    cardBody.appendChild(buttonGroup);
    card.appendChild(img);
    card.appendChild(cardBody);
    cardWrapper.appendChild(card);
    favoritesList.appendChild(cardWrapper);
}

function loadFavorites() {
    const favorites = getFavoriteRefs();
    if (favorites.length === 0) {
        showEmpty("You have no favorite exercises yet.");
        return;
    }

    const muscles = [...new Set(favorites.map(item => item.muscle))];
    const fetches = muscles.map(muscle =>
        fetch(`data/${muscle}.json`)
            .then(res => res.json())
            .then(exercises => ({ muscle, exercises }))
    );

    Promise.all(fetches)
        .then(results => {
            const exerciseMap = {};
            results.forEach(result => {
                exerciseMap[result.muscle] = result.exercises;
            });

            const favoriteExercises = favorites
                .map(item => {
                    const exercise = (exerciseMap[item.muscle] || []).find(ex => ex.id === item.id);
                    return exercise ? { muscle: item.muscle, exercise } : null;
                })
                .filter(Boolean);

            if (favoriteExercises.length === 0) {
                showEmpty("Your saved favorites could not be loaded.");
                return;
            }

            favoritesList.innerHTML = "";
            favoritesEmpty.style.display = "none";
            favoriteExercises.forEach(item => renderFavoriteCard(item.muscle, item.exercise));
        })
        .catch(err => {
            console.error("Could not load favorite exercises", err);
            showEmpty("Unable to load favorite exercises right now.");
        });
}

loadFavorites();
