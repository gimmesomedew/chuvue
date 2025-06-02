# Contact Form System

This document provides instructions for setting up and using the contact form system in the Dog Services Directory application.

## Overview

The contact form system allows users to send messages to the site administrators. It includes:

- A public contact form page at `/contact`
- A database table to store submissions
- An admin interface to view and manage submissions at `/admin/contact`

## Setup Instructions

### 1. Install Dependencies

The contact form system requires several dependencies. Run the following command to install them:

```bash
npm install @radix-ui/react-label @radix-ui/react-toast date-fns @hookform/resolvers zod react-hook-form dotenv
```

### 2. Set Up the Database Table

The contact form submissions are stored in a `contact_submissions` table in your Supabase database. You can set up this table in one of two ways:

#### Option 1: Using the Migration Script

1. Make sure your `.env.local` file contains both your Supabase URL and service role key:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. Run the migration script:

```bash
node scripts/run-migrations.js
```

#### Option 2: Manual SQL Execution

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `migrations/001_create_contact_submissions_table.sql`
4. Paste the SQL into the editor and run it

## Using the Contact Form

### For Users

Users can access the contact form at `/contact`. The form includes the following fields:

- Name (required)
- Email (required)
- Phone (optional)
- Subject (optional)
- Message (required)

When a user submits the form, they'll receive a toast notification confirming that their message was sent successfully.

### For Administrators

Administrators can view and manage contact form submissions at `/admin/contact`. This page is only accessible to users with the `admin` role.

The admin interface provides the following features:

- View all contact form submissions
- Filter submissions by status (new, read, replied, archived)
- Mark submissions as read, replied to, or archived
- Paginate through multiple pages of submissions

## Customization

### Form Fields

To add or modify form fields:

1. Update the `contactFormSchema` in `components/contact/ContactForm.tsx`
2. Update the `ContactFormData` interface in `lib/contact.ts`
3. Modify the database table schema accordingly

### Email Notifications

Currently, the system does not send email notifications when new submissions are received. To add this feature, you could:

1. Set up an email service (like SendGrid, Mailgun, etc.)
2. Create a serverless function that sends an email when a new submission is created
3. Call this function from the contact form API route

## Troubleshooting

### Database Issues

If you encounter issues with the database table:

1. Check that the `contact_submissions` table exists in your Supabase database
2. Verify that the table has the correct schema
3. Ensure that the Row Level Security (RLS) policies are correctly configured

### Access Issues

If administrators cannot access the admin interface:

1. Verify that the user has the `admin` role
2. Check the `hasRole` function in `lib/supabase.ts` to ensure it's correctly identifying admin users

## Logging

The contact form system includes logging for debugging purposes. Check your browser console or server logs for information about form submissions and errors.
