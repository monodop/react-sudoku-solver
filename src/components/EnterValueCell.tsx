import {
    beginSolving,
    CELL_FIXED,
    CELL_FLOATING,
    CellState,
    clearCell,
    NextActionSet,
    resetBoardState,
    setCell
} from "../state/board";
import * as React from "react";
import {useDispatch} from "redux-react-hook";

export interface EnterValueCellProps {
    cell: CellState;
}

export const EnterValueCell = (props:EnterValueCellProps) => {

    const { cell } = props;
    const { x, y } = cell;
    const dispatch = useDispatch();

    if (cell.type === CELL_FLOATING) {

        return (
            <div className="cell cell-floating">
                {Array(9).fill(0).map((_, i) => {
                    let n = i + 1;
                    let className = "floating-number hide-unless-hovering";

                    let onClick = () => {
                        dispatch(setCell(x, y, n));
                    };

                    return (
                        <div key={n} className={className} onClick={onClick}>
                            {n}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (cell.type === CELL_FIXED) {

        let className = "cell cell-fixed mark-initial-value";

        let onClick = () => {
            dispatch(clearCell(x, y));
        };

        return (
            <div className={className} onClick={onClick}>
                {cell.value}
            </div>
        )
    }

    throw new Error('unknown cell type');
};