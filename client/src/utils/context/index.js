import React from "react";

export const SelectedBookContext = React.createContext({
    show: false,
    setShow: ()=> {}
});

export const BookModalContext = React.createContext({
    selectedBook: {},
    setSelectedBook: ()=> {}
});