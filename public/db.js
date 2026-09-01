// Cloud Database Helper - JSONBin.io
const DB_CONFIG = {
    apiKey: '$2a$10$yfB3p0M4J5AEXjbPVzKtBuPhJAN5t.P4NkuiSKw6NC55bIMWn8c9K',
    binId: '6a96b84dda38895dfe2a9fd8',
    baseUrl: 'https://api.jsonbin.io/v3'
};

// Initialize or get bin ID
async function initDB() {
    let binId = localStorage.getItem('db_bin_id');
    if (binId) {
        DB_CONFIG.binId = binId;
        return binId;
    }
    
    // Use existing bin ID from config
    localStorage.setItem('db_bin_id', DB_CONFIG.binId);
    return DB_CONFIG.binId;
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
        
        return result.success;
    } catch (error) {
        console.error('Error saving section:', error);
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
        
        return result.success;
    } catch (error) {
        console.error('Error saving all data:', error);
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
