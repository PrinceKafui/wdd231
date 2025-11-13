export function setSectionSelection(sections) {
    const sectionSelect = document.querySelector("#sectionNumber");
    // Clear existing options except the first one
    while (sectionSelect.children.length > 1) {
        sectionSelect.removeChild(sectionSelect.lastChild);
    }
    
    sections.forEach((section) => {
        const option = document.createElement("option");
        option.value = section.section;
        option.textContent = section.section;
        sectionSelect.appendChild(option);
    });
}