// Data handling module
export async function fetchServices() {
    try {
        const response = await fetch('data/services.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.services.slice(0, 15); // Return first 15 services as required
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

export function filterServices(services, category) {
    return services.filter(service => service.category === category);
}

export function sortServices(services, sortBy = 'name') {
    return [...services].sort((a, b) => {
        if (sortBy === 'price') {
            return a.price - b.price;
        } else if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });
}

export function getPopularServices(services) {
    return services.filter(service => service.popular);
}