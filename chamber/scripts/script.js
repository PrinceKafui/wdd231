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

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

async function initializePage() {
    await loadMemberData();
    
    displayMembers(currentView);
    
    setupEventListeners();
    
    setFooterInfo();
}

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

function setupEventListeners() {
    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));
    
    hamburger.addEventListener('click', toggleMobileMenu);
    
    document.addEventListener('click', closeMobileMenuOnClickOutside);
    
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function switchView(viewType) {
    currentView = viewType;
    
    gridViewBtn.classList.toggle('active', viewType === 'grid');
    listViewBtn.classList.toggle('active', viewType === 'list');
    
    displayMembers(viewType);
}

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

function displayGridView() {
    directoryContainer.className = 'directory-grid';
    
    membersData.forEach(member => {
        const card = createMemberCard(member);
        directoryContainer.appendChild(card);
    });
}

function displayListView() {
    directoryContainer.className = 'directory-list';
    
    membersData.forEach(member => {
        const item = createMemberListItem(member);
        directoryContainer.appendChild(item);
    });
}

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