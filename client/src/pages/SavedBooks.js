import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Jumbotron, Container, CardColumns } from 'react-bootstrap';

import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import CustomCard from '../components/CustomeCard';

const SavedBooks = () => {

  //const userDataLength = Object.keys(userData).length;

  const [removeBook] = useMutation(REMOVE_BOOK);

  const { data, loading } = useQuery(GET_ME);

  const userData = data?.me || {};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId }
      });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks?.map((book) => {
            return (
              <CustomCard
                key={book.bookId}
                book={book}
                allBooks={userData.savedBooks}
                component="saved book"
                handleDeleteBook={handleDeleteBook}
              />
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
