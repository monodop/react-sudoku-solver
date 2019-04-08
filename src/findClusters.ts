
export interface Cluster {
    indices: number[];
    matches: number[];
    subClusters: Cluster[];
}

function distinct<T>(items: T[]): T[] {
    return items.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
}

export function removeRange<T>(arr: T[], toRemove: T[]): T[] {
    return arr.filter(item => !toRemove.includes(item));
}

export function applyClusters(data: number[][], clusters: Cluster[]): number[][] {
    let result: number[][] = data.map(() => []);
    for (let cluster of clusters) {
        for (let i of cluster.indices) {
            result[i] = data[i].filter(v => cluster.matches.includes(v));
        }
    }
    return result;
}

export function findBothClusterSets(data: number[][]): [Cluster[], Cluster[]] {

    let indexToValue: number[] = [];
    let valueToIndex: { [key: number]: number } = {};
    let inverseData: number[][] = [];
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        for (let v of d) {

            if (!(v in valueToIndex)) {
                valueToIndex[v] = indexToValue.length;
                indexToValue.push(v);
                inverseData.push([]);
            }
            let index = valueToIndex[v];
            inverseData[index].push(i);
        }
    }

    const flipCluster = (cluster: Cluster): Cluster => ({
        indices: cluster.matches,
        matches: cluster.indices.map(index => indexToValue[index]),
        subClusters: cluster.subClusters.map(flipCluster),
    });

    let normalClusters = findClusters(data);
    let inverseClusters = findClusters(inverseData).map(flipCluster);

    return [normalClusters, inverseClusters];
}

export function findClusters(data: number[][]): Cluster[] {

    // let clusters: Cluster[] = [];
    let allIndices = data.map<[number[], number]>((v, i) => [v, i])
        .filter(([v, i]) => v.length > 0)
        .map(([v, i]) => i);
    let allValues = distinct(data.reduce((prev, current) => [...prev, ...current], []));

    for (let i = 0; i < data.length; i++) {

        let d = data[i];
        if (d.length === 0 || d.length === allValues.length)
            continue;

        let matchingSetIndices: number[] = [];
        for (let j = 0; j < data.length; j++) {

            if (!allIndices.includes(j))
                continue;

            let extraValues = removeRange(data[j], d);
            if (extraValues.length === 0) {
                matchingSetIndices.push(j);
            }

        }

        if (d.length === matchingSetIndices.length) {
            let leftCluster: Cluster = {
                indices: matchingSetIndices,
                matches: d,
                subClusters: [],
            };
            let rightCluster: Cluster = {
                indices: removeRange(allIndices, matchingSetIndices),
                matches: removeRange(allValues, d),
                subClusters: [],
            };

            if (leftCluster.indices.length > 1)
                leftCluster.subClusters = findClusters(applyClusters(data, [leftCluster]));
            if (rightCluster.indices.length > 1)
                rightCluster.subClusters = findClusters(applyClusters(data, [rightCluster]));

            return [
                leftCluster,
                rightCluster,
            ];

        }

    }
    return [];
}