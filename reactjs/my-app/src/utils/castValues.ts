
export const castNumber = (value: any) => {
  if( typeof(value) === 'number' ) {
    return value;
  }
  return parseInt(value, 10) || 0;
}