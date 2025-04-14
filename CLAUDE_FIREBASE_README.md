
# GrocerEase App - Firebase Implementation Guide for Claude AI

## Application Overview

GrocerEase is a grocery shopping platform that connects customers with local stores. It has two user types:

1. **Customers**: Create shopping lists and submit them to stores for fulfillment
2. **Store Owners**: Manage inventory and fulfill customer orders

## Current Authentication System

The app currently uses a mock authentication system that stores user state in LocalStorage:
- User authentication state is managed by the `AuthContext` in `src/main.tsx`
- User types are either 'customer' or 'store'
- Store owners require verification code "ADMIN1445" during signup

## Current Application Structure

### Pages
- **Index.tsx**: Landing page with redirection based on auth status
- **SignIn.tsx**: Login form for both customer and store users
- **SignUp.tsx**: Registration form with conditional verification for store owners
- **Lists.tsx**: Customer view showing all shopping lists
- **ListDetail.tsx**: Detailed view of a single shopping list
- **StoreDashboard.tsx**: Store owner dashboard with order management

### Key Components
- **ShoppingLists.tsx**: Displays all customer lists, allows creation/deletion/sharing
- **ListEditor.tsx**: Interface for creating and editing lists
- **OrdersList.tsx**: Displays orders for store owners to process
- **StoreStats.tsx**: Shows key metrics for store owners

### Authentication Flow
- Non-authenticated users see home page with signup/login options
- After login, users are directed based on role (customers to /lists, store owners to /dashboard)
- Store owners require verification code "ADMIN1445" during signup
- Auth state persists via localStorage

## Firebase Implementation Requirements

### Authentication
1. Replace the mock auth in `AuthContext` with Firebase Authentication
2. Implement email/password authentication
3. Store user role (customer/store) in Firebase user claims or Firestore
4. Maintain the store owner verification check (code: "ADMIN1445")

### Database (Firestore)
1. **Users Collection**:
   - Store user profiles with roles and personal details
   - Separate store information for store owner accounts

2. **Lists Collection**:
   - Store shopping lists with items, quantities, and status
   - Include timestamps and owner references
   - Implement sharing functionality between users

3. **Orders Collection**:
   - Convert lists to orders when submitted
   - Track order status (submitted, processing, ready, completed)
   - Store relationship between customer, list, and fulfilling store

### Security Rules
1. Ensure users can only access their own data
2. Store owners should only see orders assigned to them
3. Shared lists should be accessible to both owner and shared users

### Integration Points
1. **src/main.tsx**: Replace AuthContext implementation
2. **src/pages/SignIn.tsx** & **src/pages/SignUp.tsx**: Integrate Firebase Auth
3. **src/components/lists/ShoppingLists.tsx**: Replace mock data with Firestore queries
4. **src/components/store/OrdersList.tsx**: Pull order data from Firestore
5. **src/components/lists/ListEditor.tsx**: Save directly to Firestore

## Implementation Steps

1. **Firebase Project Setup**:
   - Create Firebase project
   - Enable Authentication (email/password)
   - Create Firestore database
   - Set up Firebase SDK configuration

2. **Authentication Migration**:
   - Install Firebase packages
   - Add Firebase config to the project
   - Update `AuthContext` to use Firebase Auth
   - Modify SignIn/SignUp components

3. **Firestore Schema Implementation**:
   - Create data models for users, lists, and orders
   - Implement CRUD operations for each collection
   - Set up security rules

4. **Component Integration**:
   - Replace all mock data calls with Firestore queries
   - Implement real-time listeners for data updates

5. **Deployment**:
   - Configure hosting settings
   - Deploy application

## Database Schema

### Users Collection
```
users/{userId}
  - uid: string
  - email: string
  - fullName: string
  - userType: 'customer' | 'store'
  - createdAt: timestamp
  - storeDetails: {  // Only for store owners
      name: string,
      address: string,
      verificationStatus: boolean
    }
```

### Lists Collection
```
lists/{listId}
  - id: string
  - name: string
  - ownerId: string (ref to users/{userId})
  - createdAt: timestamp
  - updatedAt: timestamp
  - items: [
      {
        id: string,
        name: string,
        quantity: string,
        brand: string,
        isAvailable: boolean
      }
    ]
  - status: 'draft' | 'submitted' | 'processing' | 'ready' | 'completed'
  - sharedWith: [string] (array of user IDs)
```

### Orders Collection
```
orders/{orderId}
  - id: string
  - listId: string (ref to lists/{listId})
  - customerId: string (ref to users/{userId})
  - storeId: string (ref to users/{userId} where userType is 'store')
  - createdAt: timestamp
  - updatedAt: timestamp
  - status: 'submitted' | 'processing' | 'ready' | 'completed'
  - items: [
      {
        id: string,
        name: string,
        quantity: string,
        brand: string,
        isAvailable: boolean,
        substitutions: [string]
      }
    ]
```

## Firebase Configuration

This configuration will need to be added to the project:

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Key Transition Points

1. **Auth Context** (src/main.tsx):
   - Replace localStorage with Firebase auth
   - Update login/logout methods
   - Add user document creation on signup

2. **Sign Up Flow** (src/pages/SignUp.tsx):
   - Maintain verification code check for store owners
   - Create user in Firestore after Firebase auth account creation

3. **Lists Management** (src/components/lists/ShoppingLists.tsx):
   - Replace static lists with Firestore queries
   - Add real-time listeners for list updates

4. **Store Dashboard** (src/pages/StoreDashboard.tsx):
   - Query orders assigned to the current store
   - Implement real-time updates for new orders

## Important Implementation Notes

1. **Store Owner Verification**:
   - Maintain the "ADMIN1445" verification code check before creating store accounts
   - Consider implementing admin approval for store accounts

2. **Security Rules**:
   - Ensure users can only read/write their own data
   - Allow shared access to lists based on the sharedWith array
   - Restrict order management to assigned stores

3. **User Experience**:
   - Add loading states during Firebase operations
   - Implement proper error handling for auth and database operations
   - Consider offline support for editing lists
