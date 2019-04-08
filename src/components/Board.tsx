import * as React from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {BoardState, getNextAction} from "../state/board";
import {AppState} from "../state/root";
import {Cell} from "./Cell";

const getBoardState = (appState: AppState): BoardState => appState.board;

export const Board = (props: {}) => {

    let state = useMappedState(getBoardState);
    let nextActionSet = getNextAction(state);

    let dispatch = useDispatch();

    let onClick = () => {
        for (let action of nextActionSet.actions) {
            dispatch(action);
        }
    };

    return (
        <div>
            <div className="board-container">
                <div className="cell-container">
                    {state.cells.map((row, y) => row.map((cell, x) => (
                        <Cell key={`${x},${y}`} cell={cell} nextActionSet={nextActionSet} />
                    )))}
                </div>
                <div className="explanation">
                    <h2>Explanation</h2>
                    {nextActionSet.messages.map((message, i) =>
                        <p key={i}>{message}</p>
                    )}
                </div>
            </div>
            <button onClick={onClick}>Next</button>
        </div>
    );

};