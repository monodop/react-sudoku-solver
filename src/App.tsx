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
            <p>
                This solver is not a very robust sudoku solver. Instead, it aims to see how many puzzles can be
                solved by using only these three rules:
            </p>
            <ol>
                <li>If a cell has only one possible value, choose that.</li>
                <li>If a value exists in the same row, column, or square as a cell, remove that value from the candidate list.</li>
                <li>Create clusters of numbers in a row, column, or square. A cluster is defined as a set of N numbers that
                    exists in only N cells in the same region. For more details, try having the solver walk through the default
                    puzzle, and you will be able to see a few examples.</li>
            </ol>
            <p>
                If given an invalid puzzle, this solver may leave cells blank or fill in values in invalid places. I have not added in any
                checks for that. If given an unsolvable puzzle, or one that is too difficult for this solver, it will state that
                the puzzle is complete, but still leave the remaining candidates in the grid.
            </p>
            <Board />
        </StoreContext.Provider>
    )
};
