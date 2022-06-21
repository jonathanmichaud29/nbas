
export const getStatHits = (single: number, double: number, triple: number, homerun: number) => {
  return single + double + triple + homerun;
}

export const getStatIndexHits = (index: number, single: Array<number>, double: Array<number>, triple: Array<number>, homerun: Array<number>) => {
  return single[index] + double[index] + triple[index] + homerun[index];
}

export const getStatSlugging = (single: number, double: number, triple: number, homerun: number) => {
  return single + 
    ( ( double + 1) * 2 ) - 2 +
    ( ( triple + 1) * 3 ) - 3 + 
    ( ( homerun + 1) * 4 ) - 4;
}
export const getStatIndexSlugging = (index: number, single: Array<number>, double: Array<number>, triple: Array<number>, homerun: Array<number>) => {
  return single[index] + 
    ( ( double[index] + 1) * 2 ) - 2 +
    ( ( triple[index] + 1) * 3 ) - 3 + 
    ( ( homerun[index] + 1) * 4 ) - 4;
}