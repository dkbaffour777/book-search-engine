import React from "react";
import { Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { BookModalContext, SelectedBookContext } from "../utils/context";

const CustomCard = ({book, allBooks, component, savedBookIds, handleDeleteBook, handleSaveBook}) => {
    return (
        <Card>
            {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' style={{ height: "300px" }} /> : null}
            <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className='small'>Authors: {book.authors}</p>
                <Card.Text>
                    {
                        book.description?.length > 0 &&
                        <>
                            {book.description?.substr(0, 50)}
                            {"...   "}
                            <BookModalContext.Consumer>
                                {({ show, setShow }) => (
                                    <SelectedBookContext.Consumer>
                                        {({ setSelectedBook }) => (
                                            <small
                                                onClick={() =>
                                                    setSelectedBook(() => {
                                                        setShow(!show);
                                                        return allBooks?.filter(_book => _book.bookId === book.bookId)[0];
                                                    })
                                                }
                                                style={{ cursor: "pointer" }}
                                            >
                                                read more
                                            </small>
                                        )}
                                    </SelectedBookContext.Consumer>
                                )}
                            </BookModalContext.Consumer>
                        </>
                    }
                </Card.Text>
                {/* Saved book button*/}
                {
                    component === "saved book" &&
                        <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                            Delete this Book!
                        </Button>
                }
                {/* Search book button*/}
                {
                    component === "searched book" &&
                        (Auth.loggedIn() && (
                            <Button
                            disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                            className='btn-block btn-info'
                            onClick={() => {
                                handleSaveBook(book.bookId)
                            }}>
                            {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                                ? 'This book has already been saved!'
                                : 'Save this Book!'}
                            </Button>
                        ))

                }
            </Card.Body>
        </Card>
    );
}

export default CustomCard;