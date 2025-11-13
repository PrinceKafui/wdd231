export function setTitle(course) {
    const courseName = document.querySelector("#courseName");
    const courseCode = document.querySelector("#courseCode");
    courseName.textContent = course.name;
    courseCode.textContent = course.code;
}

export function renderSections(sections) {
    const html = sections.map(
        (section) => `<tr>
        <td>${section.section}</td>
        <td>${section.enrolled}</td>
        <td>${section.instructor}</td>
    </tr>`
    );
    document.querySelector("#sections").innerHTML = html.join("");
}