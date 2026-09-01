// Cloud Database Helper - JSONBin.io
const DB_CONFIG = {
    apiKey: '$2a$10$yfB3p0M4J5AEXjbPVzKtBuPhJAN5t.P4NkuiSKw6NC55bIMWn8c9K',
    binId: null, // Will be created on first save
    baseUrl: 'https://api.jsonbin.io/v3'
};

// Initialize or get bin ID
async function initDB() {
    let binId = localStorage.getItem('db_bin_id');
    if (binId) {
        DB_CONFIG.binId = binId;
        return binId;
    }
    
    // Create new bin with default data
    const defaultData = {
        hero: { title: 'Learn the Art of Coffee', subtitle: 'Professional Barista Training in Bhaktapur', btn: 'Explore Courses' },
        about: { title: 'About Us', subtitle: 'Your Journey to Becoming a Professional Barista Starts Here', desc: 'One O One Coffee & Barista School is a premier coffee training institution located in Bhaktapur, Nepal. Founded in 2019, we have been committed to transforming coffee enthusiasts into skilled professionals.', year: '2019', students: '7,000+', centers: '3' },
        content: { phone1: '9851316494', phone2: '9851165283', email: 'info@101coffee.com.np', facebook: 'https://www.facebook.com/101coffeeschool/', instagram: 'https://www.instagram.com/101coffeeandbaristaschool/', tiktok: 'https://www.tiktok.com/@101coffeeandbaristaschoo', loc1: 'Suryabinayak, Bhaktapur', loc2: 'Gatthaghar (Training School)' },
        courses: [
            { id: 1, name: 'Free Demo Class', duration: '1 Hour', price: 'FREE', desc: 'Experience our teaching style with a hands-on session.', features: ['Hands-on Experience', 'Meet Our Trainers', 'Tour Facilities', 'No Commitment'], isFree: true },
            { id: 2, name: 'Basic to Advance', duration: '10 Days', price: 'NPR 10,000', desc: 'Complete barista training from basics to professional level.', features: ['Espresso Basics', 'Milk Steaming', 'Latte Art', 'Commercial Machine Training'] },
            { id: 3, name: 'Advance Training', duration: '30 Days', price: 'NPR 18,000', desc: 'Master advanced techniques and business skills.', features: ['Advanced Latte Art', 'Coffee Business', 'Quality Control', 'Industry Certification'] },
            { id: 4, name: 'Personal Coaching', duration: 'Flexible', price: 'Contact Us', desc: 'One-on-one personalized training at your own pace.', features: ['Custom Schedule', 'Individual Attention', 'Focus on Your Goals', 'Flexible Timing'] }
        ],
        sales: [
            { id: 1, name: 'Machine & Equipment', desc: 'Professional coffee machines and tools for cafes and homes.', link: 'machines.html', features: ['Espresso Machines', 'Coffee Grinders', 'Brewing Equipment', 'Barista Tools'] },
            { id: 2, name: 'Coffee Beans 1kg', desc: 'Premium roasted beans - NPR 2,500/kg', link: 'beans.html', features: ['Light Roast', 'Medium Roast', 'Dark Roast', 'Custom Blends'], price: 'NPR 2,500' },
            { id: 3, name: 'Consultant Services', desc: 'Expert cafe setup consulting and business planning.', link: 'consultant.html', features: ['Cafe Setup', 'Menu Development', 'Equipment Selection', 'Business Planning'] }
        ],
        team: [
            { id: 1, name: 'Team Member 1', role: 'Head Barista', photo: 'photos1.jpg', facebook: '', instagram: '', desc: '' },
            { id: 2, name: 'Team Member 2', role: 'Coffee Trainer', photo: 'photos2.jpg', facebook: '', instagram: '', desc: '' },
            { id: 3, name: 'Team Member 3', role: 'Latte Art Expert', photo: 'photos3.jpg', facebook: '', instagram: '', desc: '' }
        ],
        gallery: [
            { url: 'photos1.jpg', category: 'training' },
            { url: 'photos2.jpg', category: 'training' },
            { url: 'photos3.jpg', category: 'training' },
            { url: 'latte.jpg', category: 'coffee' },
            { url: 'machine.jpg', category: 'coffee' },
            { url: 'drinks.jpg', category: 'coffee' },
            { url: 'art.jpg', category: 'events' }
        ],
        contact: { title: 'Get In Touch', desc: 'Have questions? We would love to hear from you.', map: '' },
        footer: { copyright: '2026 One O One Coffee & Barista School. All Rights Reserved.', sisterName: 'Paakshala Academy of Hospitality', sisterUrl: 'https://paakshala.edu.np' },
        orders: [],
        submissions: []
    };

    try {
        const response = await fetch(`${DB_CONFIG.baseUrl}/bin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': DB_CONFIG.apiKey
            },
            body: JSON.stringify(defaultData)
        });
        
        const result = await response.json();
        DB_CONFIG.binId = result.metadata.id;
        localStorage.setItem('db_bin_id', DB_CONFIG.binId);
        return DB_CONFIG.binId;
    } catch (error) {
        console.error('Error creating bin:', error);
        return null;
    }
}

// Get all data from database
async function dbGetAll() {
    try {
        if (!DB_CONFIG.binId) {
            await initDB();
        }
        
        const response = await fetch(`${DB_CONFIG.baseUrl}/b/${DB_CONFIG.binId}/latest`, {
            headers: {
                'X-Master-Key': DB_CONFIG.apiKey
            }
        });
        
        const result = await response.json();
        return result.record;
    } catch (error) {
        console.error('Error getting data:', error);
        return null;
    }
}

// Get specific section data
async function dbGet(section) {
    try {
        const data = await dbGetAll();
        return data ? data[section] : null;
    } catch (error) {
        console.error('Error getting section:', error);
        return null;
    }
}

// Save specific section data
async function dbSave(section, data) {
    try {
        const allData = await dbGetAll() || {};
        allData[section] = data;
        
        const response = await fetch(`${DB_CONFIG.baseUrl}/b/${DB_CONFIG.binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': DB_CONFIG.apiKey
            },
            body: JSON.stringify(allData)
        });
        
        const result = await response.json();
        
        // Also save to localStorage as backup
        localStorage.setItem('site_' + section, JSON.stringify(data));
        
        return result.success;
    } catch (error) {
        console.error('Error saving section:', error);
        // Fallback to localStorage
        localStorage.setItem('site_' + section, JSON.stringify(data));
        return false;
    }
}

// Save all data at once
async function dbSaveAll(allData) {
    try {
        const response = await fetch(`${DB_CONFIG.baseUrl}/b/${DB_CONFIG.binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': DB_CONFIG.apiKey
            },
            body: JSON.stringify(allData)
        });
        
        const result = await response.json();
        
        // Also save to localStorage as backup
        Object.keys(allData).forEach(key => {
            localStorage.setItem('site_' + key, JSON.stringify(allData[key]));
        });
        
        return result.success;
    } catch (error) {
        console.error('Error saving all data:', error);
        // Fallback to localStorage
        Object.keys(allData).forEach(key => {
            localStorage.setItem('site_' + key, JSON.stringify(allData[key]));
        });
        return false;
    }
}

// Add item to array section
async function dbAddItem(section, item) {
    try {
        const data = await dbGet(section) || [];
        data.push(item);
        return await dbSave(section, data);
    } catch (error) {
        console.error('Error adding item:', error);
        return false;
    }
}

// Update item in array section
async function dbUpdateItem(section, id, updates) {
    try {
        const data = await dbGet(section) || [];
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            return await dbSave(section, data);
        }
        return false;
    } catch (error) {
        console.error('Error updating item:', error);
        return false;
    }
}

// Delete item from array section
async function dbDeleteItem(section, id) {
    try {
        const data = await dbGet(section) || [];
        const filtered = data.filter(item => item.id !== id);
        return await dbSave(section, filtered);
    } catch (error) {
        console.error('Error deleting item:', error);
        return false;
    }
}

// Initialize database on load
initDB();
