// Directory page JavaScript

// DOM elements
const membersContainer = document.getElementById('members-container');
const gridViewButton = document.getElementById('grid-view');
const listViewButton = document.getElementById('list-view');

// Global variable to store members data
let membersData = [];

// Function to fetch members data from JSON file
async function fetchMembersData() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        membersData = await response.json();
        displayMembers('grid');
    } catch (error) {
        console.error('Error fetching members data:', error);
        membersContainer.innerHTML = '<p>Sorry, we could not load the member directory at this time.</p>';
    }
}

// Function to display members
function displayMembers(viewType) {
    // Clear container
    membersContainer.innerHTML = '';
    
    // Check if we have data
    if (membersData.length === 0) {
        membersContainer.innerHTML = '<p>No member data available.</p>';
        return;
    }
    
    // Set container class for styling
    membersContainer.className = viewType === 'grid' ? 'grid-view' : 'list-view';
    
    // Create member elements
    membersData.forEach(member => {
        const memberElement = createMemberElement(member, viewType);
        membersContainer.appendChild(memberElement);
    });
}

// Function to create a member element based on view type
function createMemberElement(member, viewType) {
    const membershipLevels = {
        1: { name: 'Member', class: 'member' },
        2: { name: 'Silver', class: 'silver' },
        3: { name: 'Gold', class: 'gold' }
    };
    
    const membership = membershipLevels[member.membershipLevel];
    
    if (viewType === 'grid') {
        // Create grid card
        const card = document.createElement('div');
        card.className = 'member-card';
        
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name}" loading="lazy" onerror="this.src='images/placeholder-business.jpg'">
            <h3>${member.name}</h3>
            <p>${member.description}</p>
            <p>${member.address}</p>
            <p>${member.email}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            <span class="membership-badge ${membership.class}">${membership.name} Member</span>
        `;
        
        return card;
    } else {
        // Create list item
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        
        listItem.innerHTML = `
            <img src="${member.image}" alt="${member.name}" loading="lazy" onerror="this.src='images/placeholder-business.jpg'">
            <h3>${member.name}</h3>
            <span class="membership-badge ${membership.class}">${membership.name}</span>
            <p>${member.address}<br>${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Website</a>
        `;
        
        return listItem;
    }
}

// Event listeners for view toggle
gridViewButton.addEventListener('click', () => {
    gridViewButton.classList.add('active');
    listViewButton.classList.remove('active');
    displayMembers('grid');
});

listViewButton.addEventListener('click', () => {
    listViewButton.classList.add('active');
    gridViewButton.classList.remove('active');
    displayMembers('list');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchMembersData();
});