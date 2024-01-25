# Charity Organisation
## Introduction
A comprehensive web platform designed for a charity organization. It facilitates donations of money and essential items for individuals in need, ensuring support without discrimination. The website includes a role-based access system with a main admin, subadmins, and area-specific admins. Users can register, donate, and submit requests, and admins have the ability to manage users, donations, and requests.

## Features
1. User Authentication
- Secure Login System: Users can register and log in securely to access personalized features.
2. Role-Based Access
- Main Admin: Oversees the entire platform, manages subadmins and global settings.
- Subadmins: Assigned to specific regions or areas, responsible for managing area-specific admins and donations.
- Area Admins: Assigned to specific areas, manage users, donations, and support requests within their designated regions.
3. Donation Management
- Donation Forms: User-friendly forms for submitting donation details.
- Donation Listing: Display a list of donations made by users.
- Edit and Delete: Ability to edit and delete donation entries.
4. User Management
- User Profiles: Users can create and manage their profiles.
- Admin Panel: Administrators can manage user accounts.
5. Area-Specific Support
- Request Form: Individuals in need can submit requests for support in specific areas.
- Area-Specific Admins: Manage support requests and donations within their designated regions.
6. Database Integration
- MySQL Database: Store user information, donation details, and support requests securely.
## Project Structure
1. Backend (Node.js and Express)
- Routes: Define routes for handling user authentication, donations, requests, and admin functions.
- Controllers: Implement controllers to handle business logic.
- Database Integration: Use MySQL to store and retrieve data securely.
2. Frontend (HTML, CSS, and EJS)
- Views: Render dynamic HTML pages using the EJS templating engine.
- Forms: Create user-friendly forms for donations, user registration, and requests.
