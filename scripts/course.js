// Course functionality
document.addEventListener('DOMContentLoaded', function() {
    // Course data array with additional details
    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Programming Building Blocks',
            credits: 2,
            completed: true,
            description: 'Introduction to programming using a language such as Python. Covers fundamental programming concepts including variables, data types, control structures, functions, and basic algorithms.',
            certificate: 'Web and Computer Programming Certificate',
            technology: ['Python', 'VS Code', 'Git'],
            semester: 'Fall 2025'
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            completed: true,
            description: 'Introduction to web design and development. Covers HTML, CSS, and basic JavaScript for creating responsive and accessible websites.',
            certificate: 'Web and Computer Programming Certificate',
            technology: ['HTML', 'CSS', 'JavaScript', 'GitHub'],
            semester: 'Winter 2025'
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            completed: false,
            description: 'Further development of programming skills with emphasis on functions, parameter passing, and modular program design.',
            certificate: 'Web and Computer Programming Certificate',
            technology: ['Python', 'Functions', 'Modules', 'Testing'],
            semester: 'Spring 2025'
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            completed: false,
            description: 'Introduction to object-oriented programming. Covers classes, objects, inheritance, polymorphism, and encapsulation.',
            certificate: 'Web and Computer Programming Certificate',
            technology: ['C#', 'OOP', 'Classes', 'Inheritance'],
            semester: 'Fall 2025'
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            completed: true,
            description: 'Building on WDD130, this course covers dynamic web development with JavaScript, DOM manipulation, and asynchronous programming.',
            certificate: 'Web and Computer Programming Certificate',
            technology: ['JavaScript', 'DOM', 'APIs', 'JSON'],
            semester: 'Winter 2024'
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            completed: false,
            description: 'Advanced frontend development techniques including modern JavaScript frameworks, responsive design, and web performance optimization.',
            certificate: 'Web and Computer Programming Certificate',
            technology: ['JavaScript', 'DOM', 'APIs', 'JSON'],
            semester: 'Spring 2025'
        }
    ];
    
    const courseCardsContainer = document.getElementById('courseCards');
    const allBtn = document.getElementById('allBtn');
    const wddBtn = document.getElementById('wddBtn');
    const cseBtn = document.getElementById('cseBtn');
    const creditCountSpan = document.getElementById('creditCount');
    const courseDetailsModal = document.getElementById('course-details');
    
    let currentFilter = 'all';
    
    // Function to display courses
    function displayCourses(filter = 'all') {
        // Filter courses based on selection
        let filteredCourses;
        if (filter === 'all') {
            filteredCourses = courses;
        } else if (filter === 'wdd') {
            filteredCourses = courses.filter(course => course.subject === 'WDD');
        } else if (filter === 'cse') {
            filteredCourses = courses.filter(course => course.subject === 'CSE');
        }
        
        // Clear existing cards
        courseCardsContainer.innerHTML = '';
        
        // Create and append course cards
        filteredCourses.forEach(course => {
            const card = document.createElement('div');
            card.className = `course-card ${course.completed ? 'completed' : ''}`;
            
            card.innerHTML = `
                <div class="course-code">${course.subject} ${course.number}</div>
                <div class="course-title">${course.title}</div>
                <div class="course-credits">${course.credits} credits</div>
                <div class="course-status">${course.completed ? 'Completed' : 'In Progress'}</div>
            `;
            
            // Add click event to show course details
            card.addEventListener('click', () => {
                displayCourseDetails(course);
            });
            
            courseCardsContainer.appendChild(card);
        });
        
        // Update credit count
        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
        creditCountSpan.textContent = totalCredits;
        
        // Update active button
        updateActiveButton(filter);
    }
    
    // Function to display course details in modal
    function displayCourseDetails(course) {
        courseDetailsModal.innerHTML = '';
        courseDetailsModal.innerHTML = `
            <button id="closeModal" aria-label="Close dialog">❌</button>
            <div class="course-modal-header">
                <h2 class="course-modal-title">${course.subject} ${course.number}</h2>
                <h3 class="course-modal-subtitle">${course.title}</h3>
            </div>
            <div class="course-modal-meta">
                <span class="course-meta-item"><strong>Credits:</strong> ${course.credits}</span>
                <span class="course-meta-item"><strong>Status:</strong> ${course.completed ? 'Completed' : 'In Progress'}</span>
                <span class="course-meta-item"><strong>Semester:</strong> ${course.semester}</span>
            </div>
            <div class="course-modal-description">
                <p>${course.description}</p>
            </div>
            <div class="course-modal-certificate">
                <p><strong>Certificate:</strong> ${course.certificate}</p>
            </div>
            <div class="course-modal-tech">
                <p><strong>Technology Stack:</strong></p>
                <div class="tech-tags">
                    ${course.technology.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Show the modal
        courseDetailsModal.showModal();
        
        // Close modal when clicking the close button
        const closeModal = document.getElementById('closeModal');
        closeModal.addEventListener('click', () => {
            courseDetailsModal.close();
        });
        
        // Close modal when clicking outside
        courseDetailsModal.addEventListener('click', (e) => {
            const dialogDimensions = courseDetailsModal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                courseDetailsModal.close();
            }
        });
    }
    
    // Function to update active filter button
    function updateActiveButton(filter) {
        // Remove active class from all buttons
        allBtn.classList.remove('active');
        wddBtn.classList.remove('active');
        cseBtn.classList.remove('active');
        
        // Add active class to current filter button
        if (filter === 'all') {
            allBtn.classList.add('active');
        } else if (filter === 'wdd') {
            wddBtn.classList.add('active');
        } else if (filter === 'cse') {
            cseBtn.classList.add('active');
        }
    }
    
    // Event listeners for filter buttons
    allBtn.addEventListener('click', function() {
        currentFilter = 'all';
        displayCourses(currentFilter);
    });
    
    wddBtn.addEventListener('click', function() {
        currentFilter = 'wdd';
        displayCourses(currentFilter);
    });
    
    cseBtn.addEventListener('click', function() {
        currentFilter = 'cse';
        displayCourses(currentFilter);
    });
    
    // Initial display of courses
    displayCourses(currentFilter);
});