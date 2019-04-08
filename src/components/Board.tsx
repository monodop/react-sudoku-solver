import * as React from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {beginSolving, BoardState, BoardStatus, getNextAction, resetBoardState, returnToEdit} from "../state/board";
import {AppState} from "../state/root";
import {SolveCell} from "./SolveCell";
import {EnterValueCell} from "./EnterValueCell";

const getBoardState = (appState: AppState): BoardState => appState.board;

export const Board = (props: {}) => {

    let state = useMappedState(getBoardState);

    let dispatch = useDispatch();

    const beginSolvingOnClick = () =>
        dispatch(beginSolving());

    const resetBoardStateOnClick = () =>
        dispatch(resetBoardState());

    const returnToEditOnClick = () =>
        dispatch(returnToEdit());

    if (state.status === BoardStatus.Solve) {

        let nextActionSet = getNextAction(state);

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
                            <SolveCell key={`${x},${y}`}
                                       cell={cell}
                                       nextActionSet={nextActionSet}
                                       isInitialValue={state.initialValues[y][x] !== 0}
                            />
                        )))}
                    </div>
                    <div className="explanation">
                        <h2>Explanation</h2>
                        {nextActionSet.messages.map((message, i) =>
                            <p key={i}>{message}</p>
                        )}
                    </div>
                </div>
                <button onClick={returnToEditOnClick}>Return to Edit Mode</button>
                {' '}
                <button onClick={resetBoardStateOnClick}>Reset Everything</button>
                {' '}
                <button onClick={onClick}>Next Step</button>
            </div>
        );
    }
    else if (state.status === BoardStatus.EnterValues) {

        return (
            <div>
                <div className="board-container">
                    <div className="cell-container">
                        {state.cells.map((row, y) => row.map((cell, x) => (
                            <EnterValueCell key={`${x},${y}`} cell={cell} />
                        )))}
                    </div>
                    <div className="explanation">
                        <h2>Instructions</h2>
                        <p>
                            Click on the small number boxes to set cells to specific values.
                        </p>
                        <p>
                            Click on the large number boxes to clear an existing cell.
                        </p>
                        <p>
                            When you are ready to solve your sudoku, press Start.
                        </p>
                    </div>
                </div>
                <button onClick={resetBoardStateOnClick}>Reset Everything</button>
                {' '}
                <button onClick={beginSolvingOnClick}>Start</button>
            </div>
        );
    }
    else {
        throw Error('unknown status');
    }

};