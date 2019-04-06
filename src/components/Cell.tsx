import {
    CELL_FIXED,
    CELL_FLOATING,
    CellState, NextActionSet, REMOVE_POSSIBLE_VALUES,
    SET_CELL
} from "../state/board";
import * as React from "react";

export interface CellProps {
    cell: CellState;
    nextActionSet: NextActionSet;
}

const willSelect = (x: number, y: number, n: number, nextActionSet: NextActionSet) => {
    for (let action of nextActionSet.actions) {
        if (action.x === x && action.y === y && action.type === SET_CELL && action.value === n)
            return true;
    }
    return false;
};
const willRemove = (x: number, y: number, n: number, nextActionSet: NextActionSet) => {
    for (let action of nextActionSet.actions) {
        if (action.x === x && action.y === y && action.type === REMOVE_POSSIBLE_VALUES && action.values.includes(n))
            return true;
    }
    return false;
};
const willHighlight = (x: number, y: number, n: number, nextActionSet: NextActionSet) => {
    for (let [cx, cy, cvalues] of nextActionSet.causes) {
        if (cx === x && cy === y && cvalues.includes(n))
            return true;
    }
    return false;
};

export const Cell = (props: CellProps) => {

    const { cell, nextActionSet } = props;
    const { x, y } = cell;

    if (cell.type === CELL_FLOATING) {
        return (
            <div className="cell cell-floating">
                {Array(9).fill(0).map((_, i) => {
                    let n = i + 1;
                    let isPossible = cell.possibleValues.includes(n);
                    let className = "floating-number";

                    if (willSelect(x, y, n, nextActionSet))
                        className += " mark-will-select";
                    if (willRemove(x, y, n, nextActionSet))
                        className += " mark-will-remove";
                    if (willHighlight(x, y, n, nextActionSet))
                        className += " mark-will-highlight";

                    return (
                        <div key={n} className={className}>
                            {isPossible ? n : ''}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (cell.type === CELL_FIXED) {

        let className = "cell cell-fixed";
        if (willHighlight(cell.x, cell.y, cell.value, nextActionSet))
            className += " mark-will-highlight";

        return (
            <div className={className}>
                {cell.value}
            </div>
        )
    }

    return <div>???</div>
};