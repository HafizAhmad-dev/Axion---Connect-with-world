Base URL:

/api/v1


Auth
POST   /auth/register
POST   /auth/login
GET    /auth/me

Users
GET    /users/search?q=
GET    /users/:id

Conversations
GET    /conversations
POST   /conversations
GET    /conversations/:id
What each does:
GET /conversations
returns list for sidebar
includes lastMessage + unreadCount
POST /conversations
create or reuse existing 1-to-1 convo
body: { participantId }
GET /conversations/:id
metadata only (not messages)


Messages
GET    /messages/:conversationId
POST   /messages
PATCH  /messages/:id/seen

Details:
GET /messages/:conversationId
paginated
newest last
POST /messages
body: { conversationId, content, type }
PATCH /messages/:id/seen
updates status