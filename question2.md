### 2. Problem: Under-Fetching
REST Example
Fetching a book and its reviews:

http

GET /books/1
http

GET /books/1/reviews
Issue: Requires two separate network requests to get all related data.

GraphQL Solution
graphql

query {
  book(id: 1) {
    title
    reviews {
      reviewer
      rating
    }
  }
}
Response:


{
  "data": {
    "book": {
      "title": "1984",
      "reviews": [
        { "reviewer": "John", "rating": 5 },
        { "reviewer": "Alice", "rating": 4 }
      ]
    }
  }
}