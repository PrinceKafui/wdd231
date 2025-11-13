const byuiCourse = {
    name: "Web Frontend Development",
    code: "WDD 130",
    section: "D3",
    year: 2021,
    semester: "Fall",
    sections: [
        { section: "D1", enrolled: 23, capacity: 25, instructor: "Brother Brown" },
        { section: "D2", enrolled: 22, capacity: 25, instructor: "Sister White" },
        { section: "D3", enrolled: 25, capacity: 25, instructor: "Brother Green" },
        { section: "D4", enrolled: 22, capacity: 25, instructor: "Sister Blue" }
    ],
    changeEnrollment: function(section, enroll = true) {
        // find the section in the sections array
        const sectionIndex = this.sections.findIndex(
            (sec) => sec.section == section
        );
        if (sectionIndex >= 0) {
            if (enroll) {
                this.sections[sectionIndex].enrolled++;
            } else {
                this.sections[sectionIndex].enrolled--;
            }
        }
        // Note: renderSections call removed as instructed
    }
};

export default byuiCourse;