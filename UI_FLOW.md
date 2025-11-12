# UI Screenshots & Flow Diagram

## App Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        APP LAUNCH                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     SPLASH SCREEN                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │                      ┌────────┐                     │   │
│  │                      │   💊   │                     │   │
│  │                      └────────┘                     │   │
│  │                                                      │   │
│  │              Medicine Reminder                      │   │
│  │              Your Health Partner                    │   │
│  │                                                      │   │
│  │                     ⟳ Loading...                    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    (Check Auth State)
                              ↓
                ┌─────────────┴─────────────┐
                ↓                           ↓
        NOT AUTHENTICATED            AUTHENTICATED
                ↓                           ↓
┌───────────────────────────────┐  ┌──────────────────────────┐
│     LOGIN/SIGNUP SCREEN       │  │      MAIN APP TABS       │
│  ┌─────────────────────────┐  │  │  ┌────────────────────┐  │
│  │         💊              │  │  │  │  Patient Screen    │  │
│  │  Medicine Reminder      │  │  │  │  ┌──────────────┐  │  │
│  │  Welcome Back!          │  │  │  │  │ 👤 user@...  │  │  │
│  │                         │  │  │  │  │      [Logout] │  │  │
│  │  ┌────────────────────┐ │  │  │  │  └──────────────┘  │  │
│  │  │ 📧 Email           │ │  │  │  │                    │  │
│  │  └────────────────────┘ │  │  │  │  Medicine List...  │  │
│  │  ┌────────────────────┐ │  │  │  │                    │  │
│  │  │ 🔒 Password  👁    │ │  │  │  └────────────────────┘  │
│  │  └────────────────────┘ │  │  │                          │
│  │                         │  │  │  ┌────────────────────┐  │
│  │  ┌────────────────────┐ │  │  │  │  Clinic Screen     │  │
│  │  │      LOGIN         │ │  │  │  │                    │  │
│  │  └────────────────────┘ │  │  │  │  Clinic Info...    │  │
│  │                         │  │  │  │  Medicine Stock... │  │
│  │  Don't have an account? │  │  │  │                    │  │
│  │       Sign Up           │  │  │  └────────────────────┘  │
│  │                         │  │  │                          │
│  └─────────────────────────┘  │  │  [Patient] [Clinic]      │
└───────────────────────────────┘  └──────────────────────────┘
```

## Screen Details

### 1. Splash Screen
- **Duration**: 2.5 seconds
- **Design**: Blue circular icon with medicine emoji
- **Text**: "Medicine Reminder" title and "Your Health Partner" subtitle
- **Loading**: Spinner at bottom
- **Colors**: White background, blue (#4A90E2) accent

### 2. Authentication Screen

#### Login Mode
- **Header**: Medicine icon, app name, "Welcome Back!"
- **Inputs**:
  - Email (with mail icon)
  - Password (with lock icon and visibility toggle)
- **Button**: Large blue "Login" button
- **Toggle**: Link to switch to Sign Up mode
- **Validation**: Real-time form validation

#### Signup Mode
- **Header**: Medicine icon, app name, "Create Your Account"
- **Inputs**:
  - Email (with mail icon)
  - Password (with lock icon and visibility toggle)
  - Confirm Password (with lock icon)
- **Button**: Large blue "Sign Up" button
- **Toggle**: Link to switch to Login mode
- **Validation**: 
  - Email format check
  - Password length (min 6 chars)
  - Passwords must match

### 3. Patient Screen (Enhanced)

#### New Header Section
```
┌─────────────────────────────────────────────────────┐
│  👤 user@example.com                    🚪 [Logout] │
│  Patient Account                                    │
└─────────────────────────────────────────────────────┘
```
- Shows logged-in user's email
- Profile icon on left
- Logout button on right
- White background with border

#### Rest of Screen
- Unchanged medicine list
- All existing functionality preserved

### 4. Navigation Flow

**On App Start:**
1. Splash Screen (always)
2. Check authentication
3. Route appropriately

**When Logged Out:**
- Login screen with toggle to signup
- Can't access main app

**When Logged In:**
- Access to Patient and Clinic tabs
- Can logout from Patient screen
- Session persists across restarts

## Color Scheme

- **Primary**: #4A90E2 (Blue)
- **Success**: #27AE60 (Green)
- **Danger**: #E74C3C (Red)
- **Text Dark**: #2C3E50
- **Text Light**: #7F8C8D
- **Background**: #F5F6FA
- **White**: #FFFFFF

## Responsive Design

All screens are:
- Responsive to different screen sizes
- Keyboard-aware (inputs don't get hidden)
- Touch-friendly (minimum 44px touch targets)
- Accessible (proper labels and hints)

## Animation & Transitions

- Smooth fade-in on splash screen
- Smooth navigation transitions
- Button press feedback
- Modal animations
- Loading spinners during async operations

## User Feedback

- Loading indicators during authentication
- Success/error alerts with clear messages
- Visual validation feedback on forms
- Confirmation dialogs for destructive actions (logout)

---

Note: Actual screenshots would require running the app. This diagram shows the structure and flow of the new authentication system.
