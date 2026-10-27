import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { useEffect, useState } from "react";

const FishBone = ({ cause, x, spineY, direction, isLongBone, totalFailedCount }) => {
  const boneLength = isLongBone ? 90 : 65;
  const y2 = direction === "top" ? spineY - boneLength : spineY + boneLength;
  const textYOffset = direction === "top" ? -10 : 25;

  // Math.min/max to ensure the number stays between 0 and 1
  const intensity = totalFailedCount > 0 ? Math.min(cause.failed / totalFailedCount, 1) : 0;

  const boneOpacity = 0.2 + intensity * 0.8;

  const boneStroke = `rgb(${Math.floor(intensity * 255)}, 0, 0)`;
  // -------------------------
const dynamicStrokeWidth = 1 + intensity * 8;
  return (
    <g>
      <line x1={x} y1={spineY} x2={x - 30} y2={y2} stroke={boneStroke} strokeWidth={dynamicStrokeWidth} strokeOpacity={boneOpacity} />

      <text x={x - 35} y={y2 + textYOffset} fontSize="12" fill="black" textAnchor="end" style={{ whiteSpace: "nowrap" }}>
        {cause.testName}
        <tspan fill={cause.failed === 0 ? "green" : "red"}> ({cause.failed})</tspan>
      </text>
    </g>
  );
};
const svgWidth = 1200;
const svgHeight = 400;
const spineY = 200;
const startX = 50;
const endX = 1100;

export default function FishboneDiagram({ params, products }) {
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    axiosInstanceIol("ate/stats/prod/" + params.selectedProduct, {
      params: { fromDate: params.fromDate, toDate: params.toDate },
    })
      .then(({ data }) => setCauses(data))
      .catch(console.log);
  }, [params]);

  const total = causes.length;
  const mid = Math.ceil(total / 2);
  const topCauses = causes.slice(0, mid);
  const bottomCauses = causes.slice(mid);

  const spineLength = endX - startX;
  const maxGroupSize = Math.max(topCauses.length, bottomCauses.length);
  const step = spineLength / (maxGroupSize + 1);
  const problem = products.find((p) => p.productId === +params.selectedProduct) || {};
  const totalFailedCount = causes.reduce((a, c) => a + c.failed, 0);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ overflow: "visible" }}>
        {/* Spine */}
        <line x1={startX} y1={spineY} x2={endX} y2={spineY} stroke="black" strokeWidth="3" />

        {/* Head */}
        <polygon points={`${endX},${spineY - 20} ${endX + 40},${spineY} ${endX},${spineY + 20}`} fill="#F96854" />
        <text x={endX + 5} y={spineY + 40} fontSize="16" fontWeight="bold" fill="#F96854" textAnchor="middle">
          {problem?.productNameEpCode}
        </text>

        {topCauses.map((cause, index) => (
          <FishBone
            key={`top-${index}`}
            cause={cause}
            x={startX + (index + 1) * step}
            spineY={spineY}
            direction="top"
            isLongBone={index % 2 === 0}
            totalFailedCount={totalFailedCount}
          />
        ))}

        {bottomCauses.map((cause, index) => (
          <FishBone
            key={`bottom-${index}`}
            cause={cause}
            x={startX + (index + 1) * step}
            spineY={spineY}
            direction="bottom"
            isLongBone={index % 2 === 0}
            totalFailedCount={totalFailedCount}
          />
        ))}
      </svg>
    </div>
  );
}
