import { auth } from '@/utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

let isAuthenticated = false;

// Function to check if the user is authenticated
export function checkAuthentication(): boolean {
    return isAuthenticated;
}

// Function to log in the user
export function login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        // Simulated asynchronous operation
        setTimeout(() => {
            if (email === 'uchuna123@gmail.com' && password === '@alKens123') {
                isAuthenticated = true;
                resolve(true);
            } else {
                isAuthenticated = false;
                reject(new Error('Invalid email or password'));
            }
        }, 1000); // Simulate delay for demonstration purposes
    });
}

// Function to log out the user
export function logout(): void {
   
    isAuthenticated = false;
}





// import { auth } from '@/utils/firebase';
// import { onAuthStateChanged } from 'firebase/auth';

// // Define a function to check if the user is authenticated
// export function checkAuthentication(): boolean {
//   let isAuthenticated = false;

//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       // User is signed in
//       isAuthenticated = true;
//     } else {
//       // User is signed out
//       isAuthenticated = false;
//     }
//   });

//   return isAuthenticated;
// }