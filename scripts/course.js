document.addEventListener('DOMContentLoaded', function() {
    
    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming (EQUIV)',
            credits: 2,
            completed: true,
            description: 'Introduction to programming using a language such as Python. Covers fundamental programming concepts including variables, data types, control structures, functions, and basic algorithms.'
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            completed: true,
            description: 'Introduction to web design and development. Covers HTML, CSS, and basic JavaScript for creating responsive and accessible websites.'
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            completed: true,
            description: 'Further development of programming skills with emphasis on functions, parameter passing, and modular program design.'
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            completed: true,
            description: 'Introduction to object-oriented programming. Covers classes, objects, inheritance, polymorphism, and encapsulation.'
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            completed: true,
            description: 'Building on WDD130, this course covers dynamic web development with JavaScript, DOM manipulation, and asynchronous programming.'
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            completed: false,
            description: 'Advanced frontend development techniques including modern JavaScript frameworks, responsive design, and web performance optimization.'
        }
    ];
    
    const courseCardsContainer = document.getElementById('courseCards');
    const allBtn = document.getElementById('allBtn');
    const wddBtn = document.getElementById('wddBtn');
    const cseBtn = document.getElementById('cseBtn');
    const creditCountSpan = document.getElementById('creditCount');
    
    let currentFilter = 'all';
    
    
    function displayCourses(filter = 'all') {
        
        let filteredCourses;
        if (filter === 'all') {
            filteredCourses = courses;
        } else if (filter === 'wdd') {
            filteredCourses = courses.filter(course => course.subject === 'WDD');
        } else if (filter === 'cse') {
            filteredCourses = courses.filter(course => course.subject === 'CSE');
        }
        
        
        courseCardsContainer.innerHTML = '';
        
        
        filteredCourses.forEach(course => {
            const card = document.createElement('div');
            card.className = `course-card ${course.completed ? 'completed' : ''}`;
            
            card.innerHTML = `
                <div class="course-code">${course.subject} ${course.number}</div>
                <div class="course-title">${course.title}</div>
                <div class="course-credits">${course.credits} credits</div>
                <div class="course-status">${course.completed ? 'Completed' : 'In Progress'}</div>
            `;
            
            courseCardsContainer.appendChild(card);
        });
        
        
        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
        creditCountSpan.textContent = totalCredits;
        
        
        updateActiveButton(filter);
    }
    
    
    function updateActiveButton(filter) {
        
        allBtn.classList.remove('active');
        wddBtn.classList.remove('active');
        cseBtn.classList.remove('active');
        
        
        if (filter === 'all') {
            allBtn.classList.add('active');
        } else if (filter === 'wdd') {
            wddBtn.classList.add('active');
        } else if (filter === 'cse') {
            cseBtn.classList.add('active');
        }
    }
    

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
    
    
    displayCourses(currentFilter);
});