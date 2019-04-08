import {Cluster, findClusters} from "./findClusters";

describe('empty array input', () => {
    it('returns an empty array', () => {

        let result = findClusters([]);
        expect(result).toEqual([]);

    });
});

describe('single data node', () => {
    it('returns a single cluster with the data node', () => {

        let expected: Cluster[] = [];
        let result = findClusters([[0]]);
        expect(result).toEqual(expected)

    });
    it('also allows arbitrary data values', () => {

        let expected: Cluster[] = [];
        let result = findClusters([[8]]);
        expect(result).toEqual(expected)

    });
});

describe('two data nodes', () => {
    it('returns two clusters when both data nodes have differing values', () => {

        let expected: Cluster[] = [
            { indices: [0], matches: [1], subClusters: [] },
            { indices: [1], matches: [2], subClusters: [] },
        ];
        let result = findClusters([[1], [2]]);
        expect(result).toEqual(expected)

    });

    it('returns one cluster when both data nodes have same values', () => {

        let expected: Cluster[] = [];
        let result = findClusters([[1, 2], [1, 2]]);
        expect(result).toEqual(expected)

    });
});

describe('three data nodes', () => {
    it('returns three clusters when all data nodes have differing values', () => {

        let expected: Cluster[] = [
            { indices: [0], matches: [1], subClusters: [] },
            { indices: [1, 2], matches: [2, 3], subClusters: [
                    { indices: [1], matches: [2], subClusters: [] },
                    { indices: [2], matches: [3], subClusters: [] },
                ] },
        ];
        let result = findClusters([[1], [2], [3]]);
        expect(result).toEqual(expected)

    });

    it('returns two clusters when both values are split between data nodes', () => {

        let expected: Cluster[] = [
            { indices: [0, 2], matches: [1, 3], subClusters: [] },
            { indices: [1], matches: [2], subClusters: [] },
        ];
        let result = findClusters([[1, 3], [2], [1, 3]]);
        expect(result).toEqual(expected)

    });

    it('returns one clusters when values are split evenly between data nodes', () => {

        let expected: Cluster[] = [];
        let result = findClusters([[1, 2], [2, 3], [1, 3]]);
        expect(result).toEqual(expected)

    });

    it('returns two clusters when one value can only be in one position', () => {

        let expected: Cluster[] = [
            { indices: [0, 2], matches: [2, 3], subClusters: [] },
            { indices: [1], matches: [1], subClusters: [] },
        ];
        let result = findClusters([[2, 3], [1, 2, 3], [2, 3]]);
        expect(result).toEqual(expected)

    });
});