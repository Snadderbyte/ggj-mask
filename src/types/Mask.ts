export const Mask = {
    NONE: { color: '#000000' },
    RED: { color: '#ff0000' },
    GREEN: { color: '#00ff00'},
    BLUE: { color: '#0000ff' },
    YELLOW: { color: '#ffff00' }
}

export type Mask = typeof Mask[keyof typeof Mask];