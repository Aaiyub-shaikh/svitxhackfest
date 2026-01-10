# Authentication Flow Testing Guide

## 🔒 Authentication System Overview

Your Smart Farm application now has a complete authentication system that restricts access based on user type:

- **Farmer Portal** (`/farmer`): Only accessible to authenticated farmers
- **Buyer Portal** (`/buyer`): Only accessible to authenticated buyers  
- **Marketplace** (`/marketplace`): Accessible to both authenticated farmers and buyers
- **AI Assistant** (`/assistant`): Accessible to both authenticated farmers and buyers

## 🧪 Testing Scenarios

### **Scenario 1: Unauthenticated User**

1. **Visit Home Page** (`http://localhost:8080/`)
   - ✅ Should see role selection page with Farmer and Buyer cards
   - ✅ Navigation shows: Home, Farmer Portal, Buyer Portal
   - ❌ No Marketplace or AI Assistant links (requires authentication)

2. **Try Direct Portal Access**
   - Visit `/farmer` → Should show login/registration form
   - Visit `/buyer` → Should show login/registration form
   - Visit `/marketplace` → Should redirect to home page
   - Visit `/assistant` → Should redirect to home page

### **Scenario 2: Farmer Registration & Login**

1. **Register as Farmer**
   - Go to `/farmer` or click "Continue as Farmer" on home page
   - Click "Don't have an account? Register"
   - Fill in farmer details: Name, Farm Name, Location, Farm Size, Phone, Email, Password
   - **IMPORTANT**: Apply database fix first (see `fix-rls-policies.sql`)
   - ✅ Should show "Registration successful!" message

2. **Login as Farmer**
   - Use registered email and password
   - ✅ Should redirect to Farmer Dashboard
   - ✅ Navigation shows: Home, Farmer Dashboard, Marketplace, AI Assistant
   - ✅ Navigation shows user info: "Farmer" badge and Logout button

3. **Test Access Permissions**
   - ✅ Can access `/farmer` (Farmer Dashboard)
   - ✅ Can access `/marketplace`
   - ✅ Can access `/assistant`
   - ❌ Cannot access `/buyer` (should redirect to `/farmer`)

### **Scenario 3: Buyer Registration & Login**

1. **Register as Buyer**
   - Go to `/buyer` or click "Continue as Buyer" on home page
   - Click "Don't have an account? Register"
   - Fill in buyer details: Name, Company Name, Phone, Email, Password
   - ✅ Should show "Registration successful!" message

2. **Login as Buyer**
   - Use registered email and password
   - ✅ Should redirect to Buyer Dashboard
   - ✅ Navigation shows: Home, Buyer Dashboard, Marketplace, AI Assistant
   - ✅ Navigation shows user info: "Buyer" badge and Logout button

3. **Test Access Permissions**
   - ✅ Can access `/buyer` (Buyer Dashboard)
   - ✅ Can access `/marketplace`
   - ✅ Can access `/assistant`
   - ❌ Cannot access `/farmer` (should redirect to `/buyer`)

### **Scenario 4: Logout Flow**

1. **Logout Process**
   - Click "Logout" button in navigation
   - ✅ Should show "Logged out successfully" toast
   - ✅ Should redirect to home page with role selection
   - ✅ Navigation updates to show only public links

2. **Post-Logout Access**
   - Try accessing protected routes directly
   - All should redirect appropriately or show login forms

## 🔧 Troubleshooting

### **Registration Issues**

**Problem**: "Registration failed" with RLS policy error
**Solution**: 
1. Go to your Supabase Dashboard
2. Open SQL Editor
3. Run the complete `fix-rls-policies.sql` script
4. Try registration again

**Problem**: User type not detected correctly
**Solution**: Check that user metadata is properly set during registration

### **Navigation Issues**

**Problem**: Wrong links showing in navigation
**Solution**: Clear browser cache and hard refresh (Ctrl+F5)

**Problem**: Redirect loops
**Solution**: Check browser console for errors, ensure user type is properly set

### **Authentication State Issues**

**Problem**: User appears logged in but can't access routes
**Solution**: 
1. Check browser dev tools → Application → Local Storage
2. Clear Supabase session data
3. Refresh and try again

## 📱 Mobile Testing

Don't forget to test the mobile experience:
- Mobile navigation menu should work correctly
- User info and logout should be accessible in mobile menu
- All authentication flows should work on mobile devices

## 🎯 Expected User Experience

### **For New Users**
1. Visit site → See role selection
2. Choose role → See registration form
3. Register → Get confirmation message
4. Login → Access appropriate dashboard
5. Navigate freely between allowed areas

### **For Returning Users**
1. Visit any URL → Automatically redirected if needed
2. See appropriate navigation based on role
3. Access their dashboard and shared features
4. Logout when done

## 📊 Testing Checklist

- [ ] Unauthenticated users see role selection page
- [ ] Farmer registration works without RLS errors
- [ ] Buyer registration works without RLS errors
- [ ] Farmers can only access farmer dashboard and shared features
- [ ] Buyers can only access buyer dashboard and shared features
- [ ] Navigation updates correctly based on authentication state
- [ ] Logout works and clears authentication
- [ ] Direct URL access is properly protected
- [ ] Mobile navigation works correctly
- [ ] User type is displayed correctly in navigation

## 🚀 Production Checklist

Before deploying:
- [ ] All RLS policies are applied in production Supabase
- [ ] Environment variables are set correctly
- [ ] Authentication URLs are configured for production domain
- [ ] Email confirmation is working (if enabled)
- [ ] Error handling is user-friendly
- [ ] Loading states are smooth
- [ ] Mobile experience is optimized

Your authentication system is now robust and user-friendly!