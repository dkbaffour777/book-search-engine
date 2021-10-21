import React, {  useReducer, useState } from 'react';
import { BookModalContext, SelectedBookContext } from './utils/context';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import BookModal from './components/BookModal';

const client = new ApolloClient({
  request: operation => {
    const token = localStorage.getItem('id_token');

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  },
  uri: '/graphql'
});

function App() {
  // book modal
  const [show, setShow] = useReducer((show) => !show, false);

  // selected book - when read more is clicked
  const [selectedBook, setSelectedBook] = useState(null);
  
  return (
    <ApolloProvider client={client}>
      <BookModalContext.Provider value={{show, setShow}}>
        <SelectedBookContext.Provider value={{selectedBook, setSelectedBook}}>
          <Router>
            <>
              <Navbar />
              <Switch>
                <Route exact path='/' component={SearchBooks} />
                <Route exact path='/saved' component={SavedBooks} />
                <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
              </Switch>
            </>
          </Router>
          <BookModal/>
        </SelectedBookContext.Provider>
      </BookModalContext.Provider>
    </ApolloProvider>
  );
}

export default App;
