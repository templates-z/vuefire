# Role Field Addition to Profile Page

## Changes Made

### 1. Updated Role Types
Updated all role definitions across the application to use the new role options:

**Previous roles:** `"admin" | "staff" | "client"`
**New roles:** `"User" | "Admin" | "Editor" | "SuperAdmin" | "Author"`

### 2. Files Modified

#### `src/services/auth.ts`
- Updated `UserProfile` interface to include new role types
- Updated `SignupData` interface to include new role types
- Updated default role assignments from `"client"` to `"User"`
- Updated permission computed properties (`isAdmin`, `isStaff`)

#### `src/types/user.ts`
- Updated `User` interface role type definition

#### `src/store/auth.ts`
- Updated default role assignment
- Fixed role mapping in user computed property

#### `src/store/profile.ts`
- Added `role` field to `UserProfile` interface as optional field

#### `src/pages/dashboard/ProfilePage.vue`
- Added `role` field to profile data structure
- Added role dropdown select in the form
- Updated load and save functions to handle role data

### 3. Profile Page UI Changes

Added a new role selection field with:
- **Label:** "Role"
- **Field Type:** Select dropdown
- **Options:**
  - User (default)
  - Admin
  - Editor
  - SuperAdmin
  - Author
- **Help text:** "Select your role in the system"

### 4. Role Permissions

Updated permission system:
- **Admin permissions:** `Admin` and `SuperAdmin` roles
- **Staff permissions:** `Admin`, `SuperAdmin`, and `Editor` roles
- **Default role:** `User` for new registrations

### 5. Data Flow

1. **New Users:** Default to `"User"` role during registration
2. **Profile Loading:** Role is loaded from Firestore or defaults to user's current role
3. **Profile Saving:** Role is saved to both the profile collection and user profile
4. **Permissions:** Role-based access control through computed properties

### 6. Usage

Users can now:
1. Navigate to Profile page (`/dashboard/profile`)
2. View their current role
3. Change their role using the dropdown
4. Save the changes to Firestore

The role field is fully integrated with the existing profile management system and maintains compatibility with the Firebase Authentication and Firestore collections.

## Testing

To test the role functionality:
1. Login to the application
2. Navigate to Profile page
3. Verify the role dropdown shows current role
4. Change the role and save
5. Refresh the page to verify persistence
6. Check Firestore console to confirm role data is saved