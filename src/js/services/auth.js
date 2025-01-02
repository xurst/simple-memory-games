// src/js/services/auth.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
    from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import firebaseConfig from './firebase-config.js';

export class AuthManager {
    constructor() {
        try {
            const app = initializeApp(firebaseConfig);
            this.auth = getAuth(app);
            this.provider = new GoogleAuthProvider();
            this.auth.useDeviceLanguage();
            this.setupAuthListeners();
            this.setupButtons();
            this.setupProtectedElements();

            this.auth.setPersistence('session');
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    }

    setupAuthListeners() {
        onAuthStateChanged(this.auth, (user) => {
            const signInButton = document.querySelector('.auth-signin');
            const logoutButton = document.querySelector('.auth-logout');
            const protectedElements = document.querySelectorAll('.protected-feature');

            if (user) {
                signInButton.textContent = `welcome, ${user.displayName}`;
                logoutButton.style.display = 'block';
                document.body.classList.add('user-signed-in');
                protectedElements.forEach(element => {
                    element.classList.remove('disabled');
                    element.style.pointerEvents = 'auto';
                });
                console.log('User signed in:', user.displayName);
            } else {
                signInButton.textContent = 'sign in';
                logoutButton.style.display = 'none';
                document.body.classList.remove('user-signed-in');
                protectedElements.forEach(element => {
                    element.classList.add('disabled');
                    element.style.pointerEvents = 'none';
                });
                if (window.location.pathname.includes('game_records.html') ||
                    window.location.pathname.includes('settings.html')) {
                    window.location.href = 'index.html';
                }
                console.log('User signed out');
            }
        }, (error) => {
            console.error('Auth state change error:', error);
        });
    }

    setupProtectedElements() {
        const protectedElements = document.querySelectorAll('.protected-feature');
        protectedElements.forEach(element => {
            if (!this.getCurrentUser()) {
                element.classList.add('disabled');
                element.style.pointerEvents = 'none';
            }

            if (element.classList.contains('navigation-link')) {
                element.addEventListener('click', (e) => {
                    if (!this.getCurrentUser()) {
                        e.preventDefault();
                        alert('Please sign in to access this feature.');
                    }
                });
            }
        });
    }

    setupButtons() {
        const signInButton = document.querySelector('.auth-signin');
        const logoutButton = document.querySelector('.auth-logout');

        if (signInButton) {
            signInButton.addEventListener('click', async () => {
                if (!this.getCurrentUser() && !this.isSigningIn) {
                    try {
                        await this.signIn();
                    } catch (error) {
                        console.error('Sign in error:', error);
                        if (error.code === 'auth/configuration-not-found') {
                            alert('Authentication service is currently unavailable. Please try again later.');
                        } else if (error.code === 'auth/popup-closed-by-user') {
                            console.log('Sign-in popup was closed');
                        } else {
                            alert('An error occurred during sign in. Please try again.');
                        }
                    }
                }
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                try {
                    await this.signOut();
                } catch (error) {
                    console.error('Sign out error:', error);
                }
            });
        }
    }

    async signIn() {
        try {
            this.provider.setCustomParameters({
                prompt: 'select_account',
                auth_type: 'reauthenticate'
            });

            const result = await signInWithPopup(this.auth, this.provider);
            return result.user;
        } catch (error) {
            console.error('Error signing in:', error);
            if (error.code === 'auth/unauthorized-domain') {
                console.error('Domain not authorized in Firebase Console');
                alert('This domain is not authorized for authentication. Please check your Firebase Console settings.');
            }
            throw error;
        }
    }

    async signOut() {
        try {
            await signOut(this.auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }
}