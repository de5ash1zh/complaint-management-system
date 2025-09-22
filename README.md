# Complaint Management System

A comprehensive complaint management system built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS. This system allows customers to submit complaints and provides an admin dashboard for managing and tracking complaint resolution.

## Features

### Customer Features
- **Complaint Submission**: Easy-to-use form with validation
- **Category Selection**: Service, Product, Billing, Technical, Other
- **Priority Levels**: Low, Medium, High
- **Email Notifications**: Automatic status updates (optional)
- **Contact Information**: Optional name and email for follow-ups

### Admin Features
- **Dashboard Overview**: Statistics and complaint summaries
- **Complaint Management**: View, update, and delete complaints
- **Status Tracking**: Pending, In Progress, Resolved, Closed
- **Advanced Filtering**: Filter by status, priority, and category
- **Real-time Updates**: Inline status editing with confirmation
- **Detailed View**: Modal with complete complaint information
- **Email Notifications**: Automatic notifications to customers and admins

## Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Email**: Nodemailer with SMTP support
- **Styling**: Tailwind CSS with responsive design
- **Validation**: Built-in form validation and MongoDB schema validation

## Project Structure

```
├── app/
│   ├── api/
│   │   └── complaints/
│   │       ├── route.ts          # GET, POST endpoints
│   │       └── [id]/route.ts     # GET, PATCH, DELETE endpoints
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Customer complaint form
├── components/
│   ├── AdminTable.tsx            # Admin complaint management table
│   ├── ComplaintForm.tsx         # Customer complaint submission form
│   └── Layout.tsx                # Shared layout component
├── lib/
│   ├── mongoose.ts               # Database connection
│   └── email.ts                  # Email notification functions
├── models/
│   └── Complaint.ts              # MongoDB complaint schema
└── env.template                  # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/complaint_management
   
   # Email (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ADMIN_EMAIL=admin@yourcompany.com
   
   # Next.js
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Customer Form: [http://localhost:3000](http://localhost:3000)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/complaints` |
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_USER` | SMTP username | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | SMTP password/app password | `your-app-password` |
| `EMAIL_FROM` | From email address | `noreply@yourcompany.com` |
| `ADMIN_EMAIL` | Admin notification email | `admin@yourcompany.com` |
| `NEXT_PUBLIC_BASE_URL` | Application base URL | `http://localhost:3000` |

## API Endpoints

### Complaints
- `GET /api/complaints` - Get all complaints with filtering and pagination
- `POST /api/complaints` - Create a new complaint
- `GET /api/complaints/[id]` - Get a specific complaint
- `PATCH /api/complaints/[id]` - Update a complaint
- `DELETE /api/complaints/[id]` - Delete a complaint

### Query Parameters (GET /api/complaints)
- `status` - Filter by status (Pending, In Progress, Resolved, Closed)
- `priority` - Filter by priority (Low, Medium, High)
- `category` - Filter by category (Service, Product, Billing, Technical, Other)
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 10)

## Database Schema

### Complaint Model
```typescript
{
  title: string (required, max 200 chars)
  description: string (required, max 2000 chars)
  category: enum (Service, Product, Billing, Technical, Other)
  priority: enum (Low, Medium, High)
  status: enum (Pending, In Progress, Resolved, Closed) - default: Pending
  dateSubmitted: Date (default: now)
  email: string (optional, validated)
  customerName: string (optional, max 100 chars)
  timestamps: createdAt, updatedAt
}
```

## Email Notifications

The system sends automatic email notifications:

1. **New Complaint**: Sent to admin when a complaint is submitted
2. **Status Update**: Sent to customer when complaint status changes (if email provided)

### Email Templates
- Professional HTML templates with company branding
- Status-specific styling and messaging
- Responsive design for mobile devices

## Usage

### For Customers
1. Visit the homepage
2. Fill out the complaint form with title, description, category, and priority
3. Optionally provide name and email for updates
4. Submit the complaint
5. Receive confirmation and status updates via email (if provided)

### For Administrators
1. Visit `/admin` for the dashboard
2. View complaint statistics and summaries
3. Use filters to find specific complaints
4. Click "View" to see full complaint details
5. Update status directly from the table
6. Delete complaints if necessary
7. Customers receive automatic email notifications for status changes

## Development

### Running in Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Key Features Implemented
- ✅ Server and Client Components (App Router)
- ✅ TypeScript with proper type safety
- ✅ MongoDB integration with Mongoose
- ✅ Email notifications with Nodemailer
- ✅ Responsive design with Tailwind CSS
- ✅ Form validation and error handling
- ✅ Real-time status updates
- ✅ Admin dashboard with filtering
- ✅ Professional email templates

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env.local
   - Verify network connectivity for Atlas

2. **Email Not Sending**
   - Verify SMTP credentials
   - For Gmail, use App Passwords instead of regular password
   - Check firewall settings for SMTP ports

3. **Build Errors**
   - Ensure all environment variables are set
   - Check TypeScript errors: `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Deployment

### Deploy to Vercel

1. **Push to GitHub/GitLab**
   - Commit your changes and push the repository to a Git provider.

2. **Import Project in Vercel**
   - Go to https://vercel.com/new and import your repository.
   - Framework preset: Next.js.

3. **Set Environment Variables (Vercel Dashboard → Project → Settings → Environment Variables)**
   - Add the following keys (copy from your `.env.local`):
     - `MONGODB_URI`
     - `EMAIL_HOST`
     - `EMAIL_PORT`
     - `EMAIL_USER`
     - `EMAIL_PASSWORD`
     - `EMAIL_FROM`
     - `ADMIN_EMAIL`
     - `NEXT_PUBLIC_BASE_URL` (set to your Vercel URL after first deploy)
   - Redeploy the project after adding environment variables.

4. **Build & Preview**
   - Vercel will build automatically.
   - Verify routes: `/`, `/admin`, and `/api/complaints`.

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas/database.
2. Create a free shared cluster and a database user (username/password).
3. Network access: allow your server IPs or set "Allow access from anywhere" during development.
4. Get your connection string from Atlas → "Connect" → "Drivers".
5. Set `MONGODB_URI` in `.env.local` and in Vercel environment variables, e.g.:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/complaint_management?retryWrites=true&w=majority
   ```

### SMTP Provider (Mailgun, SendGrid, or Gmail App Password)

- Recommended: Mailgun or SendGrid in production.
- Gmail requires an App Password (for accounts with 2FA). Do not use your normal password.

Set these vars both locally and in Vercel:
```
EMAIL_HOST=smtp.sendgrid.net          # or smtp.mailgun.org, smtp.gmail.com
EMAIL_PORT=587                        # 465 for secure/SSL
EMAIL_USER=apikey                     # for SendGrid, the username is often "apikey"
EMAIL_PASSWORD=<your_smtp_password_or_api_key>
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourcompany.com
```

## Screenshots

Add screenshots in `public/screenshots/` and reference here:

- User Complaint Form
  - `public/screenshots/complaint-form.png`
- Admin Dashboard
  - `public/screenshots/admin-dashboard.png`

Example Markdown:
```md
![Complaint Form](./public/screenshots/complaint-form.png)
![Admin Dashboard](./public/screenshots/admin-dashboard.png)
```

## Live Demo

Once deployed on Vercel, place your live link here:

- https://your-project-name.vercel.app

## Authentication & Authorization

- **NextAuth (Credentials Provider)**
  - Location: `app/api/auth/[...nextauth]/route.ts`
  - Stores role in JWT and session (`admin` or `user`).
  - Session provided via `components/AuthProvider.tsx` and wrapped in `app/layout.tsx`.
- **Models**
  - `models/User.ts`: `{ email (unique), passwordHash, role }` with timestamps.
  - Hash passwords with `bcryptjs`. Never store plain text.
- **Middleware Protection**
  - `middleware.ts` enforces that `/admin/**` requires an authenticated session with `role=admin`.
- **Login Page**
  - `app/login/page.tsx` — email/password form using `signIn('credentials')`.
  - Includes redirect support with `callbackUrl`.
- **Admin Header**
  - `components/AdminHeader.tsx` — shows current user email and a `Logout` button (`signOut`).

### Seeding an Admin User
Use MongoDB Atlas UI or shell to create an admin.

1. Generate a password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('YourStrongPassword', 10))"
```
2. Insert into `users` collection:
```js
db.users.insertOne({
  email: 'admin@example.com',
  passwordHash: '<PASTE_HASH_HERE>',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Securing API Routes

- `app/api/complaints/route.ts`
  - `GET` → admin only (403 for non-admins)
  - `POST` → requires authenticated session; attaches `userId` to the complaint
- `app/api/complaints/[id]/route.ts`
  - `PATCH` → admin only; sends status update email if status changes
  - `DELETE` → admin only

Client-side checks (e.g., hiding controls) are not enough; all authorization is enforced again on the server in API handlers.

### Environment Variables for Auth

Add to `.env.local` and Vercel:

```
NEXTAUTH_SECRET=replace-with-a-strong-random-string
NEXTAUTH_URL=http://localhost:3000
```

Generate a strong secret:
```bash
openssl rand -base64 32
```

## Deployment Checklist

- **MongoDB Atlas**: cluster, database user, IP access, and `MONGODB_URI` set
- **Vercel**: project imported and built
- **Environment Variables (Vercel)**:
  - `MONGODB_URI`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` → your Vercel URL
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`
  - `ADMIN_EMAIL`
  - `NEXT_PUBLIC_BASE_URL` → your Vercel URL
- **Test Flows**:
  - Login and logout
  - Unauthorized access to `/admin` redirects to `/login`
  - Complaint submission requires login; is saved with `userId`
  - Admin can view, update status, and delete complaints

