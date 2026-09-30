# JusticeBridge Legal Engine

JusticeBridge is a modern legal tech application designed to bridge the gap between legal professionals and clients, empowering clients, and reducing legal process delays.

## Core Features

- **Legal Directory**: Connects clients with legal advocates.
- **Secure Case Management**: Provides an isolated environment for managing legal cases.
- **Voice-Enabled Case Filing**: Supports audio input for filing cases.
- **Cybercrime Reporting**: Allows users to securely report incidents of online abuse or harassment.
- **Evidence Management**: Supports secure upload of images and videos as evidence for incident reports.
- **Real-time Updates**: Notifies users of changes in their case status via Firestore listeners.
- **Upcoming Deadline Tracking**: Integrated calendar view for tracking court hearings and important deadlines.

## Technical Architecture

- **Frontend**: React-based SPA built with Vite and Tailwind CSS.
- **Backend & Database**: Firebase Firestore (NoSQL database).
- **Authentication**: Firebase Authentication (Google OAuth).
- **Media Storage**: Firebase Storage (used for secure evidence handling).
- **AI Integration**: Server-side Gemini API integration for legal analysis capabilities.
- **PWA Capabilities**: Installable web application with offline support.

## Security & Privacy

JusticeBridge adheres to zero-trust security principles:
- **Firestore Security**: Hardened security rules enforce Attribute-Based Access Control (ABAC), ensuring users can only access their own data.
- **PII Isolation**: Sensitive data is managed through strict access controls.
- **Evidence Handling**: Media files (evidence) are securely uploaded to Firebase Storage and linked via URL to Firestore records.

## Live Deployment

- **Development URL**: https://ais-dev-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app
- **Shared/Preview URL**: https://ais-pre-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app
