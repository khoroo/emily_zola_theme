"use strict";
const knownParams = [
    { alpha: 0.8244391555, sigma: 0.1774071817, mu: -0.5116492043 },
    { alpha: 0.2773133875, sigma: 0.606448743, mu: -0.867253365 },
    { alpha: 0.4828030715, sigma: 0.0229754889, mu: 0.547388765 },
    { alpha: 0.0458912996, sigma: 0.4976365791, mu: -0.3432564696 },
    { alpha: 0.494631299, sigma: 0.1436555705, mu: -0.4371344738 },
    { alpha: 0.6278730919, sigma: 0.1061967449, mu: 0.4625240818 },
    { alpha: 0.2285134534, sigma: 0.8234970213, mu: -0.1421593999 },
    { alpha: 0.8059471909, sigma: 0.6146615464, mu: 0.6989158747 },
    { alpha: 0.014188807, sigma: 0.5116789189, mu: -0.709636987 },
    { alpha: 0.510675207, sigma: 0.6179087377, mu: -0.5320875884 },
    { alpha: 0.480478471, sigma: 0.6285355241, mu: 0.1456679021 },
    { alpha: 0.0667867267, sigma: 0.0156868822, mu: -0.4986787562 },
    { alpha: 0.0609237318, sigma: 0.4147179456, mu: 0.3022867769 },
    { alpha: 0.0377529142, sigma: 0.7564536638, mu: -0.3309395722 },
    { alpha: 0.0127874863, sigma: 0.2534660034, mu: 0.0620849106 },
    { alpha: 0.4901955992, sigma: 0.6464701979, mu: 0.7065678246 },
    { alpha: 0.9082379408, sigma: 0.8003195728, mu: 0.6174691406 },
    { alpha: 0.5578971949, sigma: 0.2023314395, mu: -0.0058459365 },
    { alpha: 0.1613274063, sigma: 0.9675522216, mu: 0.0177000695 },
    { alpha: 0.0312776923, sigma: 0.1274765691, mu: 0.1076720964 },
    { alpha: 0.9065307782, sigma: 0.2113498598, mu: 0.3449995466 },
    { alpha: 0.3745206832, sigma: 0.628306031, mu: 0.0837386053 },
    { alpha: 0.8213463426, sigma: 0.0293553252, mu: 0.4230726506 },
    { alpha: 0.4126543676, sigma: 0.5885845043, mu: -0.2138337336 },
    { alpha: 0.0350114025, sigma: 0.1551110644, mu: 0.8588986349 },
    { alpha: 0.0021805721, sigma: 0.0876592845, mu: -0.8838931438 },
    { alpha: 0.9300093068, sigma: 0.2984211352, mu: 0.5246134282 },
    { alpha: 0.0404903983, sigma: 0.5136701621, mu: -0.2481335823 }
];
const createPoint = (x, y) => ({ x, y });
const calculateG = (mu) => (x) => {
    const x2 = x * x;
    return mu * x + (2 * (1 - mu) * x2) / (1 + x2);
};
const calculateNextPoint = (point, params) => {
    const g = calculateG(params.mu);
    const { alpha, sigma } = params;
    const nextX = point.y + alpha * point.y * (1 - sigma * point.y * point.y) + g(point.x);
    return createPoint(nextX, -point.x + g(nextX));
};
function* generatePoints(params, initial, iterations) {
    let current = initial;
    for (let i = 0; i < iterations; i++) {
        current = calculateNextPoint(current, params);
        yield current;
    }
}
const main = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(15, 23, 42, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Use first set of parameters
    const params = knownParams[Math.floor(Math.random() * knownParams.length)];
    const points = Array.from(generatePoints(params, createPoint(1, 1), 20000));
    // Find bounds
    const bounds = points.reduce((acc, point) => ({
        minX: Math.min(acc.minX, point.x),
        maxX: Math.max(acc.maxX, point.x),
        minY: Math.min(acc.minY, point.y),
        maxY: Math.max(acc.maxY, point.y)
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    // Calculate scale
    const padding = 5;
    const ypadding = 5;
    const xScale = (canvas.width - 2 * padding) / (bounds.maxX - bounds.minX);
    const yScale = (canvas.height - 2 * ypadding) / (bounds.maxY - bounds.minY);
    // Draw points
    ctx.fillStyle = 'rgba(248, 250, 252, 0.8)';
    ctx.beginPath();
    points.forEach(point => {
        const x = (point.x - bounds.minX) * xScale + padding;
        const y = (point.y - bounds.minY) * yScale + padding;
        ctx.moveTo(x, y);
        ctx.arc(x, y, 0.75, 0, Math.PI * 2);
    });
    ctx.fill();
};
window.addEventListener('load', main);
