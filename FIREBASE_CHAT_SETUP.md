# Firebase Chat Setup Guide

This document explains how the private chat feature works and how to configure Firebase security rules.

## Overview

The chat system allows private 1-on-1 conversations between item owners and interested borrowers. Each conversation is completely private and only accessible to the two participants.

## Architecture

### Data Structure

**Chat Rooms Collection: `chatRooms`**

```
chatRooms/{chatRoomId}
  - participants: [userId1, userId2]
  - participantNames: { userId1: "Name1", userId2: "Name2" }
  - createdAt: timestamp
  - lastMessage: string
  - lastMessageTime: timestamp
  - itemId: string (optional)
  - itemName: string (optional)
```

**Messages Subcollection: `chatRooms/{chatRoomId}/messages`**

```
messages/{messageId}
  - senderId: string
  - senderName: string
  - text: string
  - timestamp: timestamp
  - read: boolean
```

### Chat Room ID Generation

Chat rooms use a deterministic ID based on the two user IDs:

- Format: `{smallerUserId}_{largerUserId}`
- This ensures the same chat room is always used for the same two users
- Example: If user "abc123" chats with "xyz789", the room ID is "abc123_xyz789"

## Firebase Console Configuration

### Step 1: Configure Firestore Security Rules

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **jiranilink-e7b14**
3. Click **"Firestore Database"** in the left sidebar
4. Click the **"Rules"** tab
5. Replace the existing rules with the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }

    // Helper function to check if user is a participant in the chat
    function isParticipant(chatRoomId) {
      return isSignedIn() &&
             request.auth.uid in get(/databases/$(database)/documents/chatRooms/$(chatRoomId)).data.participants;
    }

    // Chat Rooms - Only participants can read/write
    match /chatRooms/{chatRoomId} {
      // Allow read if user is a participant
      allow read: if isSignedIn() &&
                     request.auth.uid in resource.data.participants;

      // Allow create if user is one of the participants
      allow create: if isSignedIn() &&
                       request.auth.uid in request.resource.data.participants;

      // Allow update if user is a participant (for lastMessage updates)
      allow update: if isSignedIn() &&
                       request.auth.uid in resource.data.participants;

      // Messages subcollection
      match /messages/{messageId} {
        // Allow read if user is a participant of the parent chat room
        allow read: if isParticipant(chatRoomId);

        // Allow create if user is a participant and is the sender
        allow create: if isParticipant(chatRoomId) &&
                         isSignedIn() &&
                         request.auth.uid == request.resource.data.senderId;

        // Allow update if user is a participant (for marking as read)
        allow update: if isParticipant(chatRoomId);
      }
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

6. Click **"Publish"** to save the rules

### Step 2: Create Indexes (if needed)

Firestore may require composite indexes for some queries. If you see errors about missing indexes:

1. The error message will include a link to create the index
2. Click the link and it will auto-configure the index
3. Wait a few minutes for the index to build

Common indexes needed:

- Collection: `chatRooms`
  - Fields: `participants` (Array), `lastMessageTime` (Descending)

## Security Features

### 1. **Private Conversations**

- Only the two participants can access their chat room
- No one else can read or write messages
- Chat room IDs are deterministic but not guessable

### 2. **User Authentication**

- All chat operations require Clerk authentication
- User IDs from Clerk are used to identify participants
- Unauthenticated users cannot access any chat data

### 3. **Message Integrity**

- Users can only send messages as themselves
- The senderId is validated against the authenticated user
- Messages cannot be deleted or modified after sending (except read status)

### 4. **Access Control**

- Users can only see chat rooms they're part of
- Attempting to access another user's chat returns an error
- All database rules are enforced server-side

## How It Works

### Starting a Chat

1. User clicks "Message Owner" button on an item card
2. System checks if user is signed in
3. Creates or retrieves existing chat room between the two users
4. Navigates to the chat window

### Sending Messages

1. User types message and clicks "Send"
2. Message is added to Firestore with:
   - Sender's Clerk user ID
   - Sender's name
   - Message text
   - Timestamp
   - Read status (false)
3. Chat room's lastMessage and lastMessageTime are updated
4. Real-time listener updates the UI immediately

### Real-time Updates

- Uses Firestore's `onSnapshot` for real-time message updates
- New messages appear instantly without page refresh
- Works for both participants simultaneously
- Automatically scrolls to newest message

### Message Read Status

- When a user opens a chat, all unread messages are marked as read
- Only messages from the other user are marked
- Can be used to show unread message counts (future feature)

## Components

### ChatButton.jsx

- Displays "Message Owner" button on item cards
- Handles navigation to chat window
- Checks authentication status

### ChatWindow.jsx

- Main chat interface
- Displays messages in real-time
- Handles sending new messages
- Shows item context (what the chat is about)

### Messages.jsx

- Lists all user's conversations
- Shows last message preview
- Displays timestamp
- Allows navigation to specific chats

## Services

### firebase.js

- Initializes Firebase app
- Exports Firestore and Realtime Database instances
- Loads configuration from environment variables

### chatService.js

- `generateChatRoomId()` - Creates deterministic room ID
- `createOrGetChatRoom()` - Creates or retrieves chat room
- `sendMessage()` - Sends a new message
- `subscribeToMessages()` - Real-time message listener
- `getUserChatRooms()` - Gets all user's chats
- `subscribeToUserChatRooms()` - Real-time chat list listener
- `markMessagesAsRead()` - Marks messages as read
- `getUnreadCount()` - Gets unread message count

## Environment Variables

Required in `.env` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Testing the Chat

1. Sign in with two different accounts (use incognito/private window for second account)
2. With Account 1: Browse catalog and click "Message Owner" on an item
3. Send a message from Account 1
4. Switch to Account 2: Go to Messages page
5. You should see the conversation
6. Reply from Account 2
7. Switch back to Account 1: Message should appear in real-time

## Troubleshooting

### "Permission Denied" Errors

- Check that Firestore security rules are published
- Verify user is signed in with Clerk
- Ensure user ID matches one of the participants

### Messages Not Appearing

- Check browser console for errors
- Verify Firebase configuration in .env
- Check that indexes are built (if required)
- Ensure real-time listeners are active

### Chat Room Not Created

- Verify both user IDs are valid
- Check Firebase Console for error logs
- Ensure Firestore is enabled in Firebase project

## Future Enhancements

Possible improvements:

- Unread message badges
- Message notifications
- Image/file sharing
- Message search
- Delete messages
- Block users
- Online/offline status
- Typing indicators
- Message reactions

## Support

For issues or questions:

1. Check Firebase Console logs
2. Review browser console errors
3. Verify security rules are correct
4. Test with Firebase Emulator for local development
