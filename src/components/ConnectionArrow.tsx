import React, { useEffect, useRef, useState } from "react";

interface ConnectionArrowProps {
    first: React.RefObject<HTMLDivElement>;
    second: React.RefObject<HTMLDivElement>;
    end: React.RefObject<HTMLDivElement>;
    container?: React.RefObject<HTMLDivElement | null>;
}

const ConnectionArrow: React.FC<ConnectionArrowProps> = ({
    first,
    second,
    end,
    container,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [highlighted, setHighlighted] = useState(false);
    const [points, setPoints] = useState<{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        x3: number;
        y3: number;
    } | null>(null);

    useEffect(() => {
        const updatePositions = () => {
            if (first.current && second.current && end.current && container?.current) {
                const rect1 = first.current.getBoundingClientRect();
                const rect2 = second.current.getBoundingClientRect();
                const rect3 = end.current.getBoundingClientRect();
                const c = container?.current.getBoundingClientRect();
                const x = c ? c.x : 0;
                const y = c ? c.y : 0;
                setPoints({
                    x1: rect1.x - x + rect1.width,
                    y1: rect1.y - y + rect1.height / 2,
                    x2: rect2.x - x + rect2.width,
                    y2: rect2.y - y + rect2.height / 2,
                    x3: rect3.x - x + rect3.width,
                    y3: rect3.y - y + rect3.height / 2,
                });
            }
        };

        updatePositions();
        window.addEventListener("resize", updatePositions);
        return () => window.removeEventListener("resize", updatePositions);
    }, [first, second, end, container]);

    if (!points) return null;

    const lineColor = highlighted ? "orange" : "black";
    const lineWidth = highlighted ? 5 : 4;
    const markerId = `arrow-${highlighted ? "on" : "off"}`;

    return (
        <svg
            ref={svgRef}
            onClick={(e) => {
                e.stopPropagation(); // stop bubbling if multiple SVGs
                setHighlighted((prev) => !prev);
            }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                overflow: "visible",
                cursor: "pointer",
            }}
        >
            <defs>
                <marker
                    id={markerId}
                    markerWidth="5"
                    markerHeight="5"
                    refX="4"
                    refY="2.5"
                    orient="auto"
                >
                    <path d="M0,0 L5,2.5 L0,5 Z" fill={lineColor} />
                </marker>
            </defs>

            <line
                x1={points.x1 + 150}
                y1={points.y1}
                x2={points.x1}
                y2={points.y1}
                stroke={lineColor}
                strokeWidth={lineWidth}
            />
            <line
                x1={points.x1 + 150}
                y1={points.y1}
                x2={points.x1 + 150}
                y2={points.y2}
                stroke={lineColor}
                strokeWidth={lineWidth}
            />
            <line
                x1={points.x2}
                y1={points.y2}
                x2={points.x1 + 150}
                y2={points.y2}
                stroke={lineColor}
                strokeWidth={lineWidth}
            />
            <line
                x1={points.x1 + 150}
                y1={points.y2}
                x2={points.x1 + 150}
                y2={points.y3}
                stroke={lineColor}
                strokeWidth={lineWidth}
            />
            <line
                x1={points.x1 + 150}
                y1={points.y3}
                x2={points.x3}
                y2={points.y3}
                stroke={lineColor}
                strokeWidth={lineWidth}
                markerEnd={`url(#${markerId})`}
            />
        </svg>
    );
};

export default ConnectionArrow;
