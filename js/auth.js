/**
 * Hire22.ai Authentication Module
 * Handles user authentication, registration, and session management
 */

// Define auth module with global scope
window.auth = (function() {
    // Storage keys
    const STORAGE_KEYS = {
        USER: 'hire22_user',
        TOKEN: 'hire22_token',
        REFRESH_TOKEN: 'hire22_refresh_token'
    };

    // Log that auth module is being initialized
    console.log('Auth module initializing...');

    // In-memory user database for demo purposes
    // In a real application, this would be replaced with API calls
    const demoUsers = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'Password123!',
            company: 'Acme Inc',
            role: 'employer'
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            password: 'Password123!',
            company: 'Tech Solutions',
            role: 'employer'
        },
        {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike@example.com',
            password: 'Password123!',
            role: 'candidate'
        }
    ];

    /**
     * Get the current user from local storage
     * @returns {Object|null} The current user or null if not logged in
     */
    function getCurrentUser() {
        const userString = localStorage.getItem(STORAGE_KEYS.USER);
        return userString ? JSON.parse(userString) : null;
    }

    /**
     * Save user data to local storage
     * @param {Object} userData - User data to save
     * @param {string} token - Authentication token
     */
    function setCurrentUser(userData, token) {
        // Remove password before storing
        const { password, ...safeUserData } = userData;
        
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUserData));
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }

    /**
     * Clear user data from local storage
     */
    function clearCurrentUser() {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    /**
     * Generate a random token (for demo purposes)
     * @returns {string} A random token
     */
    function generateToken() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    /**
     * Find a user by email in the demo database
     * @param {string} email - User email
     * @returns {Object|null} The user object or null if not found
     */
    function findUserByEmail(email) {
        return demoUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    /**
     * Validate an email address format
     * @param {string} email - Email to validate
     * @returns {boolean} Whether the email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Login a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {boolean} remember - Whether to remember the user
     * @returns {Promise} Promise resolving to user data or rejecting with error
     */
    function login(email, password, remember = false) {
        return new Promise((resolve, reject) => {
            // Simulate API delay
            setTimeout(() => {
                try {
                    if (!email || !password) {
                        return reject({ message: 'Email and password are required' });
                    }

                    if (!isValidEmail(email)) {
                        return reject({ message: 'Invalid email format' });
                    }

                    const user = findUserByEmail(email);
                    
                    if (!user) {
                        return reject({ message: 'User not found' });
                    }

                    if (user.password !== password) {
                        return reject({ message: 'Invalid password' });
                    }

                    // Generate token
                    const token = generateToken();
                    
                    // Set user data in local storage
                    setCurrentUser(user, token);
                    
                    // Resolve with user data
                    const { password: _, ...userData } = user;
                    resolve({
                        user: userData,
                        token
                    });
                } catch (error) {
                    console.error('Login error:', error);
                    reject({ message: 'An unexpected error occurred during login. Please try again.' });
                }
            }, 800);
        });
    }

    /**
     * Register a new user
     * @param {Object} userData - User data
     * @returns {Promise} Promise resolving to user data or rejecting with error
     */
    function register(userData) {
        return new Promise((resolve, reject) => {
            // Simulate API delay
            setTimeout(() => {
                const { firstName, lastName, email, password, company, role } = userData;
                
                // Validate required fields
                if (!firstName || !lastName || !email || !password) {
                    return reject({ message: 'All required fields must be filled' });
                }

                if (!isValidEmail(email)) {
                    return reject({ message: 'Invalid email format' });
                }

                // Check if user already exists
                const existingUser = findUserByEmail(email);
                if (existingUser) {
                    return reject({ message: 'User with this email already exists' });
                }

                // Create new user
                const newUser = {
                    id: (demoUsers.length + 1).toString(),
                    firstName,
                    lastName,
                    email,
                    password,
                    company: company || '',
                    role: role || 'employer',
                    createdAt: new Date().toISOString()
                };

                // Add to demo database
                demoUsers.push(newUser);

                // Generate token
                const token = generateToken();
                
                // Set user data in local storage
                setCurrentUser(newUser, token);
                
                // Resolve with user data
                const { password: _, ...userData } = newUser;
                resolve({
                    user: userData,
                    token
                });
            }, 800);
        });
    }

    /**
     * Logout the current user
     * @returns {Promise} Promise resolving when logout is complete
     */
    function logout() {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                clearCurrentUser();
                resolve();
            }, 300);
        });
    }

    /**
     * Reset a user's password
     * @param {string} email - User email
     * @returns {Promise} Promise resolving when password reset email is sent
     */
    function resetPassword(email) {
        return new Promise((resolve, reject) => {
            // Simulate API delay
            setTimeout(() => {
                if (!email) {
                    return reject({ message: 'Email is required' });
                }

                if (!isValidEmail(email)) {
                    return reject({ message: 'Invalid email format' });
                }

                const user = findUserByEmail(email);
                
                if (!user) {
                    return reject({ message: 'User not found' });
                }

                // In a real application, send password reset email
                resolve({ message: 'Password reset instructions sent to your email' });
            }, 800);
        });
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Whether the user is authenticated
     */
    function isAuthenticated() {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    /**
     * Initialize authentication module
     */
    function init() {
        // Check for authentication token on page load
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const user = getCurrentUser();
        
        if (token && user) {
            // User is logged in
            console.log('User is authenticated:', user.email);
            
            // Update UI for logged-in state
            document.addEventListener('DOMContentLoaded', () => {
                updateUIForAuthenticatedUser(user);
            });
        }
    }

    /**
     * Update UI for authenticated user
     * @param {Object} user - User data
     */
    function updateUIForAuthenticatedUser(user) {
        // Update navigation links
        const loginLinks = document.querySelectorAll('.nav-link.login');
        loginLinks.forEach(link => {
            link.textContent = user.firstName || 'Account';
            link.href = '/account.html';  // Link to account page
        });

        // Update any other UI elements that should reflect login state
        const authButtons = document.querySelectorAll('.auth-button');
        authButtons.forEach(button => {
            if (button.classList.contains('login-button')) {
                button.textContent = 'My Account';
                button.href = '/account.html';
            } else if (button.classList.contains('signup-button')) {
                button.textContent = 'Logout';
                button.href = '#';
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout().then(() => {
                        window.location.href = '/';
                    });
                });
            }
        });
    }

    // Initialize on script load
    init();

    // Public API
    return {
        login,
        register,
        logout,
        resetPassword,
        getCurrentUser,
        isAuthenticated
    };
})();

// Log confirmation of module loading
console.log('Auth module loaded and ready');

 
 