import gql from 'graphql-tag';

const bookTypeDefs = gql`
  type Book {
    id: ID
    title: String
    author: String
  }
`;
export default bookTypeDefs;
