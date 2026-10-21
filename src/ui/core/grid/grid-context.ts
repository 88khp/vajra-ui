import { createContext } from 'react';

// Content width of the nearest Grid.Root, or null until it has been measured.
export const GridContext = createContext<number | null>(null);
