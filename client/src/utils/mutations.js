import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  input saveBookContent {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
  }
  
  mutation saveBook($content: saveBookContent!) {
    saveBook(content: $content) {
      bookId
      authors
      description
      title
      image
      link
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      bookId
      authors
      description
      title
      image
      link
    }
  }
`;
