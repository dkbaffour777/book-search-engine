import React from "react";

export const SelectedBookContext = React.createContext({
    show: true,
    setShow: ()=> {}
});

export const BookModalContext = React.createContext({
    selectedBook: {},
    setSelectedBook: ()=> {}
});