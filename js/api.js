   const API_URL = window.location.origin;

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
}


async function getUsers() { return apiCall('/users'); }
async function getUser(id) { return apiCall(`/users/${id}`); }
async function createUser(data) { return apiCall('/users', 'POST', data); }
async function updateUser(id, data) { return apiCall(`/users/${id}`, 'PATCH', data); }


async function getMenuItems() { return apiCall('/menuItems'); }
async function createMenuItem(data) { return apiCall('/menuItems', 'POST', data); }
async function updateMenuItem(id, data) { return apiCall(`/menuItems/${id}`, 'PATCH', data); }
async function deleteMenuItem(id) { return apiCall(`/menuItems/${id}`, 'DELETE'); }


async function getOrders() { return apiCall('/orders'); }
async function createOrder(data) { return apiCall('/orders', 'POST', data); }
async function updateOrder(id, data) { return apiCall(`/orders/${id}`, 'PATCH', data); }


async function getFeedback() { return apiCall('/feedback'); }
async function createFeedback(data) { return apiCall('/feedback', 'POST', data); }


async function findUserByEmail(email) {
    const users = await getUsers();
    return users.find(u => u.email === email);
}

async function getOrdersByUser(userId) {
    const orders = await getOrders();
    return orders.filter(o => o.userId === userId);
}
// -------------------- RESET PASSWORD --------------------
async function findUserByEmail(email) {
    const users = await getUsers();
    return users.find(u => u.email === email);
}

async function findUserByResetToken(token) {
    const users = await getUsers();
    return users.find(u => u.resetToken === token);
}

async function updateUserPassword(email, newPassword) {
    const users = await getUsers();
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    
    // Remove reset token after password update
    const updatedUser = { ...user, password: newPassword, resetToken: null };
    await updateUser(user.id, updatedUser);
    return updatedUser;
}


function generateResetToken() {
    return Math.random().toString(36).substring(2, 8);
}