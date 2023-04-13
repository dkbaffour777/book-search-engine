import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { Jumbotron, Container, Col, Form, Button, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { SAVE_BOOK } from '../utils/mutations';
import CustomCard from '../components/CustomeCard';

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);

  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // store the searched item
  const [searchedItem, setSearchedItem] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook] = useMutation(SAVE_BOOK);


  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    } else setSearchedItem(searchInput)

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || "",
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { ...bookToSave }
      });

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        {searchedBooks.length
          ? <h2 className="pb-5">
            Viewing {searchedBooks.length} results for
            <span style={{ fontStyle: "italic", fontWeight: "200" }}> "{searchedItem}"</span>
          </h2>
          : <h2 className="text-center p-6" style={{ color: "rgba(0,0,0, .2)" }}>Search for a book to begin</h2>}
        <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <CustomCard
                key={book.bookId}
                book={book}
                allBooks={searchedBooks}
                component="searched book"
                savedBookIds={savedBookIds}
                handleSaveBook={handleSaveBook}
              />
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBooks;
