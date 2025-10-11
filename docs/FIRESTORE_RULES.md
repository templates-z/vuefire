# Firestore Security Rules Documentation

## Overview
This document explains the Firestore security rules implemented for role-based access control in the Vue Firebase Template.

## Rule Structure

### Helper Functions

#### `isAdmin()`
```javascript
function isAdmin() {
  return request.auth != null && 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin' ||
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'SuperAdmin');
}
```
- **Purpose:** Checks if the authenticated user has Admin or SuperAdmin role
- **Logic:** 
  1. Verifies user is authenticated
  2. Checks if user document exists in `/users` collection
  3. Reads the user's role field
  4. Returns true if role is "Admin" or "SuperAdmin"

#### `isOwner(userId)`
```javascript
function isOwner(userId) {
  return request.auth != null && request.auth.uid == userId;
}
```
- **Purpose:** Checks if the authenticated user owns the document
- **Logic:** Compares the authenticated user's UID with the document's userId

### Collection Rules

#### 1. Users Collection (`/users/{userId}`)
```javascript
match /users/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow write: if isOwner(userId) || isAdmin();
}
```
- **Read Access:** User can read their own document OR admins can read any user document
- **Write Access:** User can write their own document OR admins can write any user document

#### 2. User Profiles Collection (`/userProfiles/{userId}`)
```javascript
match /userProfiles/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow write: if isOwner(userId) || isAdmin();
}
```
- **Read Access:** User can read their own profile OR admins can read any profile
- **Write Access:** User can write their own profile OR admins can write any profile

#### 3. General Admin-Only Collections
```javascript
match /{collection}/{document=**} {
  allow read, write: if isAdmin();
}
```
- **Purpose:** Catch-all rule for collections not explicitly defined
- **Access:** Only Admin and SuperAdmin roles can read/write
- **Note:** This rule applies to any collection not matched by more specific rules above

## Role Hierarchy

### Roles and Permissions

1. **SuperAdmin**
   - ✅ Full read/write access to all collections
   - ✅ Can manage all user documents and profiles
   - ✅ Highest level of access

2. **Admin**
   - ✅ Full read/write access to all collections
   - ✅ Can manage all user documents and profiles
   - ✅ Same permissions as SuperAdmin (can be differentiated in application logic)

3. **Editor**
   - ❌ No special Firestore permissions (application-level permissions only)
   - ✅ Can read/write own documents only

4. **Author**
   - ❌ No special Firestore permissions (application-level permissions only)
   - ✅ Can read/write own documents only

5. **User**
   - ❌ No special Firestore permissions
   - ✅ Can read/write own documents only

## Security Features

### 1. Authentication Required
- All rules require `request.auth != null`
- Anonymous users have no access to any documents

### 2. Document Existence Check
- Admin function verifies user document exists before checking role
- Prevents errors when user document is missing

### 3. Role-Based Access Control
- Roles are stored in user documents and checked dynamically
- Admin roles (Admin, SuperAdmin) get elevated permissions
- Regular users can only access their own documents

### 4. Hierarchical Security
- More specific rules (users, userProfiles) take precedence
- General admin rule catches all other collections
- Ensures no unprotected collections

## Usage Examples

### Successful Operations

```javascript
// SuperAdmin user reading any user document
// ✅ Allowed: isAdmin() returns true

// Regular user reading their own profile
// ✅ Allowed: isOwner(userId) returns true

// Admin user writing to any collection
// ✅ Allowed: isAdmin() returns true
```

### Blocked Operations

```javascript
// Regular user trying to read another user's document
// ❌ Blocked: isOwner() returns false, not admin

// Unauthenticated request
// ❌ Blocked: request.auth is null

// User with "Editor" role trying to access admin-only collection
// ❌ Blocked: isAdmin() returns false (Editor is not Admin/SuperAdmin)
```

## Testing Rules

### 1. Deploy Rules
```bash
firebase deploy --only firestore:rules
```

### 2. Test Scenarios
1. **Admin Access Test:** Login as Admin, try accessing other users' data
2. **User Access Test:** Login as regular User, try accessing own vs others' data
3. **Unauthenticated Test:** Test without authentication
4. **Role Change Test:** Change user role and verify permission changes

### 3. Firebase Emulator Testing
```bash
firebase emulators:start --only firestore
```

## Best Practices

1. **Always test rules thoroughly** before deploying to production
2. **Use Firebase Emulator** for safe testing during development
3. **Monitor Firestore usage** for blocked requests indicating rule issues
4. **Keep role definitions consistent** between application code and rules
5. **Consider adding logging** for security rule violations

## Future Enhancements

1. **Granular Permissions:** Add collection-specific role checks
2. **Time-Based Access:** Add rules for temporary permissions
3. **Field-Level Security:** Restrict specific fields based on roles
4. **Audit Logging:** Track admin actions for compliance