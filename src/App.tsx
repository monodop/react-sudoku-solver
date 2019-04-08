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
            <h1>
                Sudoku Solver
            </h1>
            <Board />
        </StoreContext.Provider>
    )
};
