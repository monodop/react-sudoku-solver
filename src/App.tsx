import React  from 'react';
import {createStore} from "redux";
import {rootReducer} from "./state/root";
import {Board} from "./components/Board";
import {StoreContext} from 'redux-react-hook';

import './App.css';

const store = createStore(rootReducer);

export const App = (props: {}) => {
    return (
        <StoreContext.Provider value={store}>
            <header>
                Sudoku Solver
            </header>
            <Board />
        </StoreContext.Provider>
    )
};
