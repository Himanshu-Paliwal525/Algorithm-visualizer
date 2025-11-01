// import { useEffect } from "react";
// import Module from "./wasm/example.js";
import React, { useRef, useState } from "react";
import { mergeSort } from "./utils/mergeSort";
import ConnectionArrow from "./components/ConnectionArrow";
interface CallbackType {
    arr: number[];
    count: number;
    type: "left" | "right" | "merged";
}
function App() {
    const [stringArray, setStringArray] = useState("");
    const [array, setArray] = useState<number[]>([]);
    const pairRefs = useRef<
        { step: number; first: number; second: number; end: number }[]
    >([]);
    const mergedPairRefs = useRef<
        { step: number; first: number; second: number; end: number }[]
    >([]);
    const arrayRefs = useRef<Record<number, React.RefObject<HTMLDivElement>>>(
        {}
    );
    const [sequenceList, setSequenceList] = useState<
        {
            step: number;
            array: number[];
            type: "left" | "right" | "merged";
        }[]
    >([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState(0);

    const callbackFunction = ({ arr, count, type }: CallbackType) => {
        setSequenceList((prev) => [
            ...prev,
            {
                step: count,
                array: arr,
                type: type,
            },
        ]);
    };

    const handleStart = () => {
        setSequenceList([]);
        if (array.length === 0) return;
        const N = 1e3;
        const start = performance.now();
        for (let i = 0; i < N; i++) {
            const copy = [...array];
            mergeSort(copy);
        }

        const end = performance.now();
        const copy = [...array];
        mergeSort(copy, callbackFunction);
        setSequenceList((prev) => [
            ...prev,
            { step: 0, array: copy.sort((a, b) => a - b), type: "merged" },
        ]);
        setTime((end - start) / N);
    };

    pairRefs.current = [];
    mergedPairRefs.current = [];
    const stack: {
        first: number;
        step: number;
    }[] = [];
    const mergedStack: {
        first: number;
        step: number;
    }[] = [];
    sequenceList.forEach((seq, index) => {
        if (stack.length && stack[stack.length - 1].step === seq.step) {
            const { first } = stack[stack.length - 1];
            stack.pop();
            pairRefs.current.push({
                step: seq.step,
                first,
                second: index - 1,
                end: index,
            });
            if (seq.type === "merged") {
                if (
                    mergedStack.length &&
                    mergedStack[mergedStack.length - 1].step === seq.step
                ) {
                    const { first } = mergedStack[mergedStack.length - 1];
                    mergedStack.pop();
                    mergedPairRefs.current.push({
                        step: seq.step,
                        first,
                        second: index,
                        end: index + 1,
                    });
                } else mergedStack.push({ step: seq.step, first: index });
            }
        } else {
            stack.push({ step: seq.step, first: index });
            if (seq.type === "merged")
                mergedStack.push({ step: seq.step, first: index });
        }
    });
    // console.log("pair ref", pairRefs.current);
    // console.log("merged pair ref", mergedPairRefs.current);
    return (
        <div className="h-[100vh] flex flex-col">
            <h1 className="text-red-900 font-bold text-3xl px-4 py-2 mb-10 shadow-lg text-center w-full">
                Algorithm Visualizer
            </h1>
            <div className="flex flex-1 overflow-auto divide-x divide-gray-600">
                <div className="min-w-1/4 flex flex-col items-center">
                    <h2>Sidebar</h2>
                </div>
                <div className="flex-1 flex flex-col">
                    <div
                        ref={containerRef}
                        className="relative flex-1 bg-neutral-100 border border-gray-100 shadow overflow-auto p-10"
                    >
                        <div className="mb-10 text-4xl flex gap-8">
                            {array.map((num) => (
                                <div
                                    className="border px-4 py-2 bg-white"
                                    key={num}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                        {sequenceList.map((sequence, index) => {
                            arrayRefs.current[index] =
                                arrayRefs.current[index] ||
                                React.createRef<HTMLDivElement>();

                            return (
                                <div className="flex items-center">
                                    <div className="text-red-500 text-2xl font-bold">
                                        Step {sequence.step}:
                                    </div>
                                    <div
                                        className="px-2 text-2xl py-2 flex items-center relative"
                                        style={{
                                            marginLeft: sequence.step * 80,
                                        }}
                                        ref={arrayRefs.current[index]}
                                    >
                                        {sequence.array.map((num) => (
                                            <div
                                                className={`border px-4 py-2 ${
                                                    sequence.step === 1
                                                        ? "bg-red-400"
                                                        : sequence.step === 2
                                                        ? "bg-blue-300"
                                                        : sequence.step === 3
                                                        ? "bg-purple-500"
                                                        : "bg-yellow-400"
                                                } ${
                                                    sequence.type === "merged"
                                                        ? "border-green-500"
                                                        : ""
                                                }`}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {/* {Array.isArray(pairRefs.current) &&
                            mergedPairRefs.current.map((pair, i) => (
                                <ConnectionArrow
                                    key={i}
                                    first={arrayRefs.current[pair.first]}
                                    second={arrayRefs.current[pair.second]}
                                    end={arrayRefs.current[pair.end]}
                                    container={containerRef}
                                />
                            ))} */}
                    </div>

                    <div className="w-full flex justify-center sticky bottom-0">
                        <div className="flex justify-center w-1/2 gap-2 bg-white my-4 border border-gray-400 shadow rounded-4xl overflow-hidden px-4 py-2">
                            <input
                                type="text"
                                id="array"
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9 ,]/g,
                                        ""
                                    );
                                    setStringArray(value);
                                    setArray(
                                        value
                                            .split(",")
                                            .filter((num) => num.trim() !== "")
                                            .map((num) => Number(num.trim()))
                                    );
                                }}
                                value={stringArray}
                                className="flex-1 placeholder:font-sans font-mono outline-none"
                                placeholder="Enter the comma separated array"
                            />
                            <button
                                onClick={handleStart}
                                className="py-1 px-4 rounded cursor-pointer bg-red-500 text-white"
                            >
                                Start
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
