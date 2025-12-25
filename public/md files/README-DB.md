Local MongoDB API

Requirements
- Set environment variable MONGODB_URI to your MongoDB connection string.

API endpoints (relative to your site root):
- GET /api/items              -> list all items
- POST /api/items             -> create an item (JSON body)
- GET /api/items/:id         -> get item by id
- PUT /api/items/:id         -> update item by id (JSON body)
- DELETE /api/items/:id      -> delete item by id

Example curl

Create:

curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d '{"title":"Hello","body":"World"}'

List:

curl http://localhost:3000/api/items

Get by id:

curl http://localhost:3000/api/items/<id>

Notes
- Install the MongoDB driver in the project: npm install mongodb
- Ensure `MONGODB_URI` is set in your environment or in a .env.local file during development.
