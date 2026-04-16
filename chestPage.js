const chestDivNode = document.getElementById("chest-list")


fetch("data/chest.json")
.then(res => res.json())
.then(exercises => {
    exercises.forEach(e => appendExerciseComponent(e));
})
.catch(err => console.error("Fetch failed:", err));

function appendExerciseComponent(chestData) {
    const newColDivNode = document.createElement("div");
    newColDivNode.id = `chest-${chestData.id}`;
    newColDivNode.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
    
    const newCardDivNode = document.createElement("div");
    newCardDivNode.className = "card m-2 p-2";

    // Add session/local storage later
    
    newCardDivNode.addEventListener("click", () => {
        window.location.href = `exercisePage.html?muscle=chest&id=${chestData.id}`;
    });

    const newTitleNode = document.createElement("h2");
    newTitleNode.innerText = `${chestData.name}`;

    // Back a badge
    // const newEquipmentBadge = document.createElement("p");
    // newAuthorPagesNode.style.fontWeight = 200;
    // newAuthorPagesNode.innerText = `by ${bookData.author} | ${bookData.numPages} pages`;

        //add image
    const newImgNode = document.createElement("img");

    newImgNode.src = chestData.pictureUrl; 
    newImgNode.alt = chestData.name + " picture";
    newImgNode.style.height = "200px";
    newImgNode.style.objectFit = "cover";

    const wrapper = document.createElement("div");
    wrapper.className = "exercise-card";
    wrapper.appendChild(newImgNode);

    newCardDivNode.appendChild(wrapper);
    //add image end 

    const newDescNode = document.createElement("p");
    newDescNode.innerText = chestData.instructions.slice(0, 100);

    newCardDivNode.appendChild(newTitleNode);
    // newCardDivNode.appendChild(newEquipmentBadge);
    newCardDivNode.appendChild(newDescNode);

    newColDivNode.appendChild(newCardDivNode);

    document.getElementById("chest-list").appendChild(newColDivNode);
}
