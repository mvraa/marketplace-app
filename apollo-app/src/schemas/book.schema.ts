import gql from 'graphql-tag';

const bookSchema = gql`
  input BookInput {
    title: String!
    author: String!
  }

  # union SingleBookResult = Book | NotExistsError

  type Query {
    book(id: ID!): Book!
    getBooks(amount: Int): [Book]
  }

  type BookSuccess {
    isSuccess: Boolean
    message: String!
  }

  type Mutation {
    createBook(bookInput: BookInput): Book!
    deleteBook(id: ID!): BookSuccess
    editBook(id: ID!, bookInput: BookInput): BookSuccess
  }
`;

export default bookSchema;
