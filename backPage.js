const chestDivNode = document.getElementById("back-list")


fetch("data/back.json")
.then(res => res.json())
.then(exercises => {
    exercises.forEach(e => appendExerciseComponent(e));
})
.catch(err => console.error("Fetch failed:", err));

function appendExerciseComponent(backData) {
    const newColDivNode = document.createElement("div");
    newColDivNode.id = `back-${backData.id}`;
    newColDivNode.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
    
    const newCardDivNode = document.createElement("div");
    newCardDivNode.className = "card m-2 p-2";

    // Add session/local storage later
    
    newCardDivNode.addEventListener("click", () => {
        window.location.href = `exercisePage.html?muscle=back&id=${backData.id}`;
    });

    const newTitleNode = document.createElement("h2");
    newTitleNode.innerText = `${backData.name}`;

    // Back a badge
    // const newEquipmentBadge = document.createElement("p");
    // newAuthorPagesNode.style.fontWeight = 200;
    // newAuthorPagesNode.innerText = `by ${bookData.author} | ${bookData.numPages} pages`;

    const newDescNode = document.createElement("p");
    newDescNode.innerText = backData.instructions.slice(0, 100);

    newCardDivNode.appendChild(newTitleNode);
    // newCardDivNode.appendChild(newEquipmentBadge);
    newCardDivNode.appendChild(newDescNode);

    newColDivNode.appendChild(newCardDivNode);

    document.getElementById("back-list").appendChild(newColDivNode);
}
