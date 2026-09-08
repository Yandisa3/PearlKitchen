let currentUser = null;

function getCurrentUser() {
    if (!currentUser) {
        const user = localStorage.getItem('currentUser');
        if (user) currentUser = JSON.parse(user);
    }
    return currentUser;
}

async function login(email, password) {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    if (!user.isActive) throw new Error('Account is deactivated');
    
    const { password: _, ...userWithoutPassword } = user;
    currentUser = userWithoutPassword;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('userId', user.id);
    return userWithoutPassword;
}

async function register(data) {
    const existing = await findUserByEmail(data.email);
    if (existing) throw new Error('Email already registered');
    
    const newUser = {
        id: Date.now(),
        ...data,
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    const created = await createUser(newUser);
    const { password: _, ...userWithoutPassword } = created;
    currentUser = userWithoutPassword;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('userId', created.id);
    return userWithoutPassword;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userId');
        window.location.href = 'index.html';
    }
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function redirectBasedOnRole() {
    const user = getCurrentUser();
    if (!user) { window.location.href = 'index.html'; return; }
    
    switch(user.role) {
        case 'customer': window.location.href = 'customer/dashboard.html'; break;
        case 'employee': window.location.href = 'employee/dashboard.html'; break;
        case 'driver': window.location.href = 'driver/deliveries.html'; break;
        case 'owner': window.location.href = 'owner/menu.html'; break;
        default: window.location.href = 'customer/dashboard.html';
    }
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}