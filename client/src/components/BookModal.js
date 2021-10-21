import React from 'react';
import { Modal } from 'react-bootstrap';
import { BookModalContext, SelectedBookContext } from '../utils/context';

const BookModal = () => {
    return (
        <>
            <BookModalContext.Consumer>
                {({show, setShow})=>(
                    <Modal show={show} onHide={setShow}>
                        <SelectedBookContext.Consumer>
                            {({ selectedBook }) => (
                                <>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{selectedBook?.title}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                        style={{maxHeight: "80vh", overflowY: "scroll"}}
                                    >
                                        {selectedBook?.description}
                                    </Modal.Body>
                                </>

                            )}
                        </SelectedBookContext.Consumer>
                    </Modal>
                )}
            </BookModalContext.Consumer>
        </>
    );
}

export default BookModal;