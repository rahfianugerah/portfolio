/**
 * Where a chart's bars and points sit, as percentages of the box that holds them.
 *
 * The visitors card and the experiences velocity card draw the same chart from different data, so
 * the geometry lives here rather than in both.
 */

/** A value's height as a share of the tallest, with a floor so an empty column still reads. */
export const barHeight = (value: number, max: number) => Math.max(4, (value / max) * 100);

/** The centre of a column, across the chart. */
export const pointX = (index: number, count: number) => ((index + 0.5) / count) * 100;

/** A value's point, measured from the top, which is where an SVG draws it. */
export const pointY = (value: number, max: number) => 100 - barHeight(value, max);
