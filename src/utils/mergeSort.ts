let count = 0;
interface CallbackType {
    arr: number[];
    count: number;
    type: "left" | "right" | "merged";
}
export function mergeSort(
    arr: number[],
    callback?: ({ arr, count, type }: CallbackType) => void
): number[] {
    if (arr.length <= 1) {
        return arr;}
    count++;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    if (callback) callback({ arr: left, count, type: "left" }); // Callback-----------------------------------------------------

    const sortedLeft = mergeSort(left, callback);

    if (callback) callback({ arr: sortedLeft, count, type: "merged" }); // Callback---------------------------------------------
    if (callback) callback({ arr: right, count, type: "right" }); // Callback---------------------------------------------------

    const sortedRight = mergeSort(right, callback);
    if (callback) callback({ arr: sortedRight, count, type: "merged" }); // Callback--------------------------------------------

    count--;
    return merge(sortedLeft, sortedRight);
}

// Helper function to merge two sorted arrays
function merge(left: number[], right: number[]): number[] {
    const result = [];
    let i = 0,
        j = 0;

    // Compare and merge elements in sorted order
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // Add any remaining elements
    return result.concat(left.slice(i)).concat(right.slice(j));
}
