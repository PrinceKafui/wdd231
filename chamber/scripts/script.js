// Global variables
let membersData = [];
let currentView = 'grid';

// DOM Elements
const directoryContainer = document.getElementById('directory-container');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const currentYear = document.getElementById('current-year');
const lastModified = document.getElementById('last-modified');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

async function initializePage() {
    // Load member data
    await loadMemberData();
    
    // Display members in grid view by default
    displayMembers(currentView);
    
    // Set up event listeners
    setupEventListeners();
    
    // Set footer information
    setFooterInfo();
}

// Load member data from JSON
async function loadMemberData() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        membersData = await response.json();
    } catch (error) {
        console.error('Error loading member data:', error);
        directoryContainer.innerHTML = '<div class="loading">Error loading member data. Please try again later.</div>';
    }
}

// Set up all event listeners
function setupEventListeners() {
    // View toggle functionality
    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', closeMobileMenuOnClickOutside);
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Switch between grid and list views
function switchView(viewType) {
    currentView = viewType;
    
    // Update active button state
    gridViewBtn.classList.toggle('active', viewType === 'grid');
    listViewBtn.classList.toggle('active', viewType === 'list');
    
    // Display members in the selected view
    displayMembers(viewType);
}

// Display members in the specified view
function displayMembers(viewType) {
    if (membersData.length === 0) {
        directoryContainer.innerHTML = '<div class="loading">Loading member data...</div>';
        return;
    }
    
    directoryContainer.innerHTML = '';
    
    if (viewType === 'grid') {
        displayGridView();
    } else {
        displayListView();
    }
}

// Display members in grid view
function displayGridView() {
    directoryContainer.className = 'directory-grid';
    
    membersData.forEach(member => {
        const card = createMemberCard(member);
        directoryContainer.appendChild(card);
    });
}

// Display members in list view
function displayListView() {
    directoryContainer.className = 'directory-list';
    
    membersData.forEach(member => {
        const item = createMemberListItem(member);
        directoryContainer.appendChild(item);
    });
}

// Create a member card for grid view
function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';
    
    card.innerHTML = `
        <div class="member-image">
            <img src="${member.image}" alt="${member.name}" loading="lazy">
        </div>
        <div class="member-info">
            <h2 class="member-name">${member.name}</h2>
            <p class="member-address">${member.address}</p>
            <p class="member-phone">${member.phone}</p>
            <p class="member-email">${member.email}</p>
            <a href="${member.website}" target="_blank" rel="noopener" class="member-website">Visit Website</a>
            <div class="membership-badge membership-${member.membershipLevel}">
                ${getMembershipLevelText(member.membershipLevel)}
            </div>
        </div>
    `;
    
    return card;
}

// Create a member list item for list view
function createMemberListItem(member) {
    const item = document.createElement('div');
    item.className = 'member-item';
    
    item.innerHTML = `
        <div class="member-image">
            <img src="${member.image}" alt="${member.name}" loading="lazy">
        </div>
        <div class="member-info">
            <h2 class="member-name">${member.name}</h2>
            <p class="member-address">${member.address}</p>
            <div class="membership-badge membership-${member.membershipLevel}">
                ${getMembershipLevelText(member.membershipLevel)}
            </div>
        </div>
        <div class="member-contact">
            <p class="member-phone">${member.phone}</p>
            <p class="member-email">${member.email}</p>
            <a href="${member.website}" target="_blank" rel="noopener" class="member-website">Website</a>
        </div>
    `;
    
    return item;
}

// Helper function to get membership level text
function getMembershipLevelText(level) {
    switch(level) {
        case 1:
            return 'Member';
        case 2:
            return 'Silver';
        case 3:
            return 'Gold';
        default:
            return 'Member';
    }
}

// Mobile menu functionality
function toggleMobileMenu() {
    navMenu.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('show'));
}

function closeMobileMenu() {
    navMenu.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
}

function closeMobileMenuOnClickOutside(event) {
    if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        closeMobileMenu();
    }
}

// Set footer information
function setFooterInfo() {
    currentYear.textContent = new Date().getFullYear();
    lastModified.textContent = document.lastModified;
}