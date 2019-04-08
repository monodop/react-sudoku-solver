import {Action} from "redux";
import produce from "immer";
import {findBothClusterSets, removeRange} from "../findClusters";

export const CELL_FIXED = 'CELL_FIXED';
export interface FixedCell {
    type: typeof CELL_FIXED;
    value: number;
}

export const CELL_FLOATING = 'CELL_FLOATING';
export interface FloatingCell {
    type: typeof CELL_FLOATING;
    possibleValues: number[];
}

export type CellState = (FixedCell | FloatingCell) & {
    x: number;
    y: number;
};

export interface Constraint {
    cells: [number, number][];
    name: string;
}

export enum BoardStatus {
    EnterValues,
    Solve,
}

export interface BoardState {
    initialValues: number[][];
    cells: CellState[][];
    constraints: Constraint[];
    status: BoardStatus;
}

export const SET_CELL = 'SET_CELL';
export interface SetCellAction extends Action {
    type: typeof SET_CELL;
    x: number;
    y: number;
    value: number;
}

export const CLEAR_CELL = 'CLEAR_CELL';
export interface ClearCellAction extends Action {
    type: typeof CLEAR_CELL;
    x: number;
    y: number;
}

export const REMOVE_POSSIBLE_VALUES = 'REMOVE_POSSIBLE_VALUES';
export interface RemovePossibleValuesAction extends Action {
    type: typeof REMOVE_POSSIBLE_VALUES;
    x: number;
    y: number;
    values: number[];
}

export const BEGIN_SOLVING = 'BEGIN_SOLVING';
export interface BeginSolvingAction extends Action {
    type: typeof BEGIN_SOLVING;
}

export const RETURN_TO_EDIT = 'RETURN_TO_EDIT';
export interface ReturnToEditAction extends Action {
    type: typeof RETURN_TO_EDIT;
}

export const RESET_BOARD_STATE = 'RESET_BOARD_STATE';
export interface ResetBoardStateAction extends Action {
    type: typeof RESET_BOARD_STATE;
}

export type BoardActions = SetCellAction
    | RemovePossibleValuesAction
    | ClearCellAction
    | BeginSolvingAction
    | ReturnToEditAction
    | ResetBoardStateAction
    ;

export const setCell = (x: number, y: number, value: number): SetCellAction => ({
    type: SET_CELL,
    x,
    y,
    value,
});

export const clearCell = (x: number, y: number): ClearCellAction => ({
    type: CLEAR_CELL,
    x,
    y,
});

export const removePossibleValues = (x: number, y: number, values: number[]): RemovePossibleValuesAction => ({
    type: REMOVE_POSSIBLE_VALUES,
    x,
    y,
    values,
});

export const beginSolving = (): BeginSolvingAction => ({
    type: BEGIN_SOLVING,
});

export const returnToEdit = (): ReturnToEditAction => ({
    type: RETURN_TO_EDIT,
});

export const resetBoardState = (): ResetBoardStateAction => ({
    type: RESET_BOARD_STATE,
});

export const generateEmptyBoard = (initialValues: number[][] = [], constraints: Constraint[] = []): BoardState => {

    let filledInitialValues: number[][] = Array(9).fill(0).map(
        (_, y) => Array(9).fill(0).map(
            (_, x): number => {
                if (initialValues.length > y && initialValues[y].length > x) {
                    return initialValues[y][x];
                }
                return 0;
            }
        )
    );

    return {
        status: BoardStatus.EnterValues,
        initialValues: filledInitialValues,
        cells: Array(9).fill(0).map(
            (_, y) => Array(9).fill(0).map(
                (_, x): CellState => {

                    if (filledInitialValues[y][x] !== 0) {
                        return {
                            type: CELL_FIXED,
                            x,
                            y,
                            value: filledInitialValues[y][x],
                        }
                    }

                    return {
                        type: CELL_FLOATING,
                        x,
                        y,
                        possibleValues: new Array(9).fill(0).map((_, i) => i + 1)
                    };
                }
            )
        ),
        constraints,
    };
};

const columnNames : {[key: number]: string} = {
    0: 'left',
    1: 'middle',
    2: 'right',
};
const rowNames : {[key: number]: string} = {
    0: 'top',
    1: 'middle',
    2: 'bottom',
};

export const generateDefaultConstraints = (): Constraint[] => {
    let constraints: Constraint[] = [];
    for (let x = 0; x < 9; x++) {
        constraints.push({
            cells: Array(9).fill(0).map((_, y) => [x, y]),
            name: `column ${x+1}`,
        });
    }
    for (let y = 0; y < 9; y++) {
        constraints.push({
            cells: Array(9).fill(0).map((_, x) => [x, y]),
            name: `row ${y+1}`,
        });
    }
    for (let ax = 0; ax < 3; ax++) {
        for (let ay = 0; ay < 3; ay++) {
            let cellCoords: [number, number][] = [];
            for (let cx = 0; cx < 3; cx++) {
                for (let cy = 0; cy < 3; cy++) {
                    cellCoords.push([ax * 3 + cx, ay * 3 + cy]);
                }
            }
            constraints.push({
                cells: cellCoords,
                name: 'the ' + ((ax === 1 && ay === 1) ? 'central' : `${rowNames[ay]}-${columnNames[ax]}`) + ' square',
            });
        }
    }
    return constraints;
};


const initialBoardState: BoardState = generateEmptyBoard(
    // [
    //     [ 0, 0, 0, 2, 0, 0, 0, 1, 3 ],
    //     [ 0, 0, 2, 0, 5, 9, 6, 0, 0 ],
    //     [ 0, 9, 0, 0, 0, 0, 0, 0, 0 ],
    //     [ 6, 0, 0, 0, 0, 0, 0, 7, 0 ],
    //     [ 7, 0, 0, 0, 8, 0, 1, 0, 0 ],
    //     [ 0, 1, 0, 0, 4, 0, 0, 0, 0 ],
    //     [ 0, 0, 6, 0, 0, 8, 0, 4, 5 ],
    //     [ 8, 0, 0, 0, 0, 0, 0, 2, 0 ],
    //     [ 0, 0, 3, 0, 0, 2, 0, 0, 0 ],
    // ],
    // [
    //     [ 8, 0, 0, 0, 0, 0, 0, 0, 0 ],
    //     [ 0, 0, 3, 6, 0, 0, 0, 0, 0 ],
    //     [ 0, 7, 0, 0, 9, 0, 2, 0, 0 ],
    //     [ 0, 5, 0, 0, 0, 7, 0, 0, 0 ],
    //     [ 0, 0, 0, 0, 4, 5, 7, 0, 0 ],
    //     [ 0, 0, 0, 1, 0, 0, 0, 3, 0 ],
    //     [ 0, 0, 1, 0, 0, 0, 0, 6, 8 ],
    //     [ 0, 0, 8, 5, 0, 0, 0, 1, 0 ],
    //     [ 0, 9, 0, 0, 0, 0, 4, 0, 0 ],
    // ],
    [
        [ 4, 0, 5, 0, 2, 0, 0, 0, 0 ],
        [ 0, 0, 0, 7, 5, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 4, 0, 3 ],
        [ 0, 2, 0, 0, 0, 8, 0, 0, 6 ],
        [ 0, 0, 0, 0, 0, 0, 7, 0, 1 ],
        [ 0, 8, 0, 0, 9, 0, 0, 0, 0 ],
        [ 0, 0, 3, 2, 7, 0, 0, 0, 0 ],
        [ 0, 0, 1, 0, 0, 0, 6, 9, 0 ],
        [ 0, 0, 7, 6, 0, 0, 0, 1, 0 ],
    ],
    generateDefaultConstraints()
);
export const boardReducer = (boardState: BoardState = initialBoardState, action: BoardActions): BoardState =>
    produce(boardState, draft => {

        if (action.type === SET_CELL) {
            draft.cells[action.y][action.x] = {
                type: CELL_FIXED,
                x: action.x,
                y: action.y,
                value: action.value,
            };

            if (draft.status === BoardStatus.EnterValues) {
                draft.initialValues[action.y][action.x] = action.value;
            }
        }

        if (action.type === REMOVE_POSSIBLE_VALUES) {
            let cell = draft.cells[action.y][action.x];
            if (cell.type === CELL_FLOATING) {
                cell.possibleValues = cell.possibleValues.filter(v => !action.values.includes(v));
            }
        }

        if (action.type === CLEAR_CELL) {
            draft.cells[action.y][action.x] = {
                type: CELL_FLOATING,
                x: action.x,
                y: action.y,
                possibleValues: Array(9).fill(0).map((_, i) => i+1),
            };

            if (draft.status === BoardStatus.EnterValues) {
                draft.initialValues[action.y][action.x] = 0;
            }
        }

        if (action.type === BEGIN_SOLVING) {
            draft.status = BoardStatus.Solve;
        }

        if (action.type === RETURN_TO_EDIT) {
            draft.status = BoardStatus.EnterValues;
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 9; y++) {
                    if (draft.initialValues[y][x] !== 0) {
                        draft.cells[y][x] = {
                            type: CELL_FIXED,
                            x,
                            y,
                            value: draft.initialValues[y][x],
                        };
                    }
                    else {
                        draft.cells[y][x] = {
                            type: CELL_FLOATING,
                            x,
                            y,
                            possibleValues: Array(9).fill(0).map((_, i) => i+1),
                        };
                    }
                }
            }
        }

        if (action.type === RESET_BOARD_STATE) {
            return generateEmptyBoard([], generateDefaultConstraints());
        }

    });

export interface NextActionSet {
    actions: (SetCellAction | RemovePossibleValuesAction)[];
    causes: [number, number, number[]][];
    messages: string[];
}

export function getNextAction(boardState: BoardState): NextActionSet {

    let nextActionSet: NextActionSet = {
        actions: [],
        causes: [],
        messages: [],
    };

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let cell = boardState.cells[y][x];
            if (cell.type === CELL_FLOATING && cell.possibleValues.length === 1) {
                nextActionSet.actions.push({
                    type: SET_CELL,
                    x,
                    y,
                    value: cell.possibleValues[0],
                })
            }
        }
    }
    if (nextActionSet.actions.length > 0) {
        nextActionSet.messages.push('The cell(s) can only be one possible value.');
        return nextActionSet;
    }

    for (let constraint of boardState.constraints) {

        for (let [x, y] of constraint.cells) {
            let cell = boardState.cells[y][x];
            if (cell.type === CELL_FIXED)
                continue;

            for (let [x2, y2] of constraint.cells) {
                let cell2 = boardState.cells[y2][x2];
                if (cell2.type === CELL_FIXED && cell.possibleValues.includes(cell2.value)) {
                    nextActionSet.actions.push({
                        type: REMOVE_POSSIBLE_VALUES,
                        x,
                        y,
                        values: [cell2.value],
                    });
                    if (!nextActionSet.causes.some(([cx, cy]) => cx === x2 && cy === y2)) {
                        nextActionSet.causes.push([x2, y2, []]);
                    }
                    let cause = nextActionSet.causes.find(([cx, cy]) => cx === x2 && cy === y2);
                    if (cause)
                        cause[2].push(cell2.value);
                }
            }
        }
    }

    if (nextActionSet.actions.length > 0) {
        nextActionSet.messages.push('The values already exist in the highlighted cells.');
        return nextActionSet;
    }

    let messages: string[] = [];
    for (let constraint of boardState.constraints) {

        let indexToCoords: [number, number][] = [];
        let data: number[][] = [];

        for (let [x, y] of constraint.cells) {
            let cell = boardState.cells[y][x];
            if (cell.type === CELL_FIXED)
                continue;

            indexToCoords.push([x, y]);
            data.push(cell.possibleValues);
        }

        let clusterList = findBothClusterSets(data);
        for (let clusters of clusterList) {

            let clusterMessages = [];
            let useClusterMessages = false;
            for (let cluster of clusters) {
                clusterMessages.push(`values ${[ ...cluster.matches].sort().join(', ')} are in cells `+
                    `${cluster.indices.map(i => `(${indexToCoords[i][0]},${indexToCoords[i][1]})`).join(', ')}`);
                for (let i of cluster.indices) {
                    let extraValues = removeRange(data[i], cluster.matches);
                    if (extraValues.length > 0) {
                        useClusterMessages = true;
                        nextActionSet.actions.push({
                            type: REMOVE_POSSIBLE_VALUES,
                            x: indexToCoords[i][0],
                            y: indexToCoords[i][1],
                            values: extraValues,
                        });
                    }
                }
            }

            if (useClusterMessages) {
                clusterMessages[clusterMessages.length - 1] = 'and ' + clusterMessages[clusterMessages.length - 1];
                messages.push(`We can build ${clusterMessages.length} clusters, such that ${clusterMessages.join(', ')}`);
                break;
            }
        }

        if (nextActionSet.actions.length > 0) {
            nextActionSet.messages = [
                `Consider ${constraint.name}.`,
                ...messages,
                'After building these clusters, we can remove some possible values from the cells.',
            ];
            return nextActionSet;
        }
    }

    nextActionSet.messages.push('The board is complete.');
    return nextActionSet;

}