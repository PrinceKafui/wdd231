// Thank you page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    displayApplicationData();
    setFooterDates();
});

function displayApplicationData() {
    const urlParams = new URLSearchParams(window.location.search);
    const summaryContainer = document.getElementById('application-summary');
    
    if (!summaryContainer) return;
    
    const requiredFields = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email Address' },
        { key: 'phone', label: 'Mobile Phone' },
        { key: 'businessName', label: 'Business Name' },
        { key: 'timestamp', label: 'Application Date' }
    ];
    
    let hasData = false;
    let summaryHTML = '';
    
    requiredFields.forEach(field => {
        const value = urlParams.get(field.key);
        if (value) {
            hasData = true;
            let displayValue = value;
            
            // Format timestamp
            if (field.key === 'timestamp') {
                try {
                    const date = new Date(value);
                    displayValue = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch (e) {
                    displayValue = value;
                }
            }
            
            summaryHTML += `
                <div class="summary-item">
                    <div class="summary-label">${field.label}</div>
                    <div class="summary-value">${displayValue}</div>
                </div>
            `;
        }
    });
    
    // Display membership level if available
    const membershipLevel = urlParams.get('membershipLevel');
    if (membershipLevel) {
        const levelDisplay = getMembershipLevelDisplay(membershipLevel);
        summaryHTML += `
            <div class="summary-item">
                <div class="summary-label">Membership Level</div>
                <div class="summary-value">${levelDisplay}</div>
            </div>
        `;
        hasData = true;
    }
    
    // Display organizational title if available
    const orgTitle = urlParams.get('orgTitle');
    if (orgTitle) {
        summaryHTML += `
            <div class="summary-item">
                <div class="summary-label">Organizational Title</div>
                <div class="summary-value">${orgTitle}</div>
            </div>
        `;
        hasData = true;
    }
    
    // Display business description if available
    const businessDescription = urlParams.get('businessDescription');
    if (businessDescription) {
        summaryHTML += `
            <div class="summary-item">
                <div class="summary-label">Business Description</div>
                <div class="summary-value">${businessDescription}</div>
            </div>
        `;
        hasData = true;
    }
    
    if (!hasData) {
        summaryHTML = `
            <div class="summary-item" style="grid-column: 1 / -1; text-align: center;">
                <div class="summary-value">No application data found. Please complete the membership form.</div>
            </div>
        `;
    }
    
    summaryContainer.innerHTML = summaryHTML;
}

function getMembershipLevelDisplay(level) {
    const levels = {
        np: 'NP Membership (Non-Profit)',
        bronze: 'Bronze Membership',
        silver: 'Silver Membership',
        gold: 'Gold Membership'
    };
    return levels[level] || level;
}

function setFooterDates() {
    // Set current year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Set last modified date
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}