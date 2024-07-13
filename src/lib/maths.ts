export { clamp, normalizeScroll }
/**
 * Normalizes the scroll position to a value between 0 and 1.
 * @param scrollY The current scroll position.
 * @param scrollHeight The total scrollable height.
 * @param outerHeight The viewport height.
 * @returns The normalized scroll position between 0 and 1.
 */
function normalizeScroll(
        scrollY: number,
        scrollHeight: number,
        outerHeight: number,
): number {
        const scroll = scrollY / (scrollHeight - outerHeight);
        return clamp(scroll, 0, 0.99);
}

/**
 * Clamps a value between a minimum and maximum value.
 * @param num The value to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The clamped value.
 */
function clamp(num: number, min: number, max: number): number {
        return Math.min(Math.max(num, min), max);
}
