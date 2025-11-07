# Chat Feature Testing Guide

## Prerequisites

✅ Firebase project created (jiranilink-e7b14)
✅ Firestore Database enabled
✅ Security rules configured
✅ Firebase SDK installed
✅ Environment variables added to .env
✅ Dev server running at http://localhost:5173

## Testing Steps

### Step 1: Sign In with First Account

1. Open your browser and go to: **http://localhost:5173**
2. Click **"Sign In"** in the navigation bar
3. Sign in with your first test account (or create a new account)
4. You should be redirected to the home page
5. Notice the navbar now shows: **Catalog, My Items, Messages, Profile**

### Step 2: Browse Catalog and Start a Chat

1. Click **"Catalog"** in the navigation
2. You should see a list of items
3. Find any item card
4. Notice the **"💬 Message Owner"** button (green button)
5. Click the **"💬 Message Owner"** button
6. You should be redirected to a chat window with the item owner

### Step 3: Send a Message

1. In the chat window, you should see:
   - Header with owner's name
   - "About: [Item Name]" subtitle
   - Empty chat area with "No messages yet. Start the conversation!"
   - Message input box at the bottom
2. Type a message like: "Hi! I'm interested in borrowing this item."
3. Click **"Send"** button
4. Your message should appear immediately on the right side (blue background)
5. The message should show the timestamp

### Step 4: Check Messages Page

1. Click **"Messages"** in the navigation bar
2. You should see your conversation listed with:
   - Owner's name
   - Item name ("About: [Item Name]")
   - Last message preview
   - Timestamp
3. Click on the conversation to open it again

### Step 5: Test with Second Account (Private Chat Verification)

**Important: Use a different browser or incognito/private window for this**

1. Open a new **incognito/private browser window**
2. Go to: **http://localhost:5173**
3. Sign in with a **different account** (the item owner's account)
4. Click **"Messages"** in the navigation
5. You should see the conversation from the first user
6. Click on it to open the chat
7. You should see the message sent by the first user
8. Reply with: "Sure! When would you like to borrow it?"
9. Click **"Send"**

### Step 6: Verify Real-Time Updates

1. **Keep both browser windows open side by side**
2. In the first account's window, you should see the reply appear **instantly** without refreshing
3. Send another message from the first account
4. The second account should see it appear **instantly**
5. This confirms real-time messaging is working!

### Step 7: Test Privacy (Important!)

1. Sign in with a **third account** (different from the two chatting)
2. Go to **Messages** page
3. You should **NOT** see the conversation between the first two users
4. This confirms the chat is **private** between only the two participants

### Step 8: Test Multiple Conversations

1. With the first account, go back to **Catalog**
2. Click **"💬 Message Owner"** on a **different item** (different owner)
3. Send a message to this new owner
4. Go to **Messages** page
5. You should now see **two separate conversations**
6. Each conversation is independent and private

## Expected Behavior

### ✅ What Should Work

1. **Authentication Required**

   - Must be signed in to access Messages page
   - Must be signed in to send messages
   - Redirects to sign-in if not authenticated

2. **Message Owner Button**

   - Appears on all item cards in Catalog
   - Hidden if viewing your own item
   - Opens chat with item owner

3. **Chat Window**

   - Shows owner's name and item context
   - Displays messages in chronological order
   - Your messages on the right (blue)
   - Other user's messages on the left (white)
   - Timestamps on all messages
   - Auto-scrolls to newest message

4. **Real-Time Updates**

   - New messages appear instantly
   - No page refresh needed
   - Works for both participants simultaneously

5. **Messages List**

   - Shows all your conversations
   - Displays last message preview
   - Shows relative timestamps (Just now, Yesterday, etc.)
   - Sorted by most recent activity

6. **Privacy**
   - Only participants can see their chat
   - Other users cannot access the conversation
   - Each chat is completely isolated

### ❌ Common Issues and Solutions

**Issue: "Permission Denied" error**

- **Solution**: Check that Firestore security rules are published correctly
- Verify you're signed in with Clerk
- Check browser console for specific error

**Issue: Messages not appearing**

- **Solution**: Check browser console for errors
- Verify Firebase configuration in .env file
- Ensure Firestore is enabled in Firebase Console
- Check that security rules allow the operation

**Issue: "Message Owner" button not showing**

- **Solution**: Make sure you're viewing someone else's item (not your own)
- Check that ItemCard component is receiving correct props
- Verify you're signed in

**Issue: Chat window shows "Loading..." forever**

- **Solution**: Check Firebase configuration
- Verify Clerk user ID is being passed correctly
- Check browser console for errors

**Issue: Real-time updates not working**

- **Solution**: Check that onSnapshot listeners are active
- Verify Firebase connection
- Check browser console for WebSocket errors

## Testing Checklist

Use this checklist to verify all features:

- [ ] Can sign in successfully
- [ ] Can see "Messages" link in navbar when signed in
- [ ] Can see "💬 Message Owner" button on item cards
- [ ] Button is hidden on own items
- [ ] Can click button and navigate to chat window
- [ ] Chat window shows correct owner name
- [ ] Chat window shows item context
- [ ] Can type and send messages
- [ ] Messages appear immediately after sending
- [ ] Messages show correct timestamp
- [ ] Can navigate back to Messages list
- [ ] Messages list shows all conversations
- [ ] Can click conversation to reopen chat
- [ ] Second user can see and reply to messages
- [ ] Real-time updates work (messages appear instantly)
- [ ] Third user cannot see private conversations
- [ ] Can have multiple separate conversations
- [ ] Each conversation maintains its own history

## Browser Console Checks

Open browser DevTools (F12) and check:

1. **Console Tab**: Should have no errors (warnings are okay)
2. **Network Tab**: Should show successful Firebase requests
3. **Application Tab** → **Local Storage**: Should see Firebase auth tokens

## Firebase Console Checks

1. Go to Firebase Console → Firestore Database
2. You should see:
   - `chatRooms` collection with your chat rooms
   - Each chat room has a `messages` subcollection
   - Messages have correct structure (senderId, text, timestamp, etc.)

## Success Criteria

The chat feature is working correctly if:

✅ Users can start private conversations from item cards
✅ Messages are sent and received in real-time
✅ Only the two participants can access their chat
✅ Multiple conversations can be maintained separately
✅ Message history persists across sessions
✅ UI is responsive and user-friendly

## Next Steps After Testing

Once testing is complete and everything works:

1. Consider adding features like:

   - Unread message badges
   - Push notifications
   - Image sharing
   - Message search
   - Delete messages

2. Monitor Firebase usage:

   - Check Firestore read/write counts
   - Monitor storage usage
   - Set up billing alerts if needed

3. Gather user feedback:
   - Is the chat easy to find?
   - Is the UI intuitive?
   - Are there any missing features?

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review FIREBASE_CHAT_SETUP.md for detailed configuration
3. Check Firebase Console logs
4. Review browser console errors
5. Verify all environment variables are set correctly
