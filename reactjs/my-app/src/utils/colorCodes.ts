
export const chartColors = {
  battingAverage:{
    bkg: 'rgba(0, 255, 0, 1)',
    border: 'rgb(255, 99, 132)'
  },
  onBasePercentage:{
    bkg: 'rgba(0, 255, 200, 1)',
    border: 'rgb(0, 180, 200)'
  },
  sluggingPercentage:{
    bkg: 'rgba(0, 180, 255, 1)',
    border: 'rgb(255, 99, 132)'
  },
  onBaseSluggingPercentage:{
    bkg: 'rgba(0, 0, 255, 1)',
    border: 'rgb(0, 0, 180)'
  },
}


const COLORS = [
  {
    hex: '#4dc9f6',
    rgb: '77, 201, 246'
  },
  {
    hex: '#f67019',
    rgb: '246, 112, 25'
  },
  {
    hex: '#f53794',
    rgb: '245, 55, 148'
  },
  {
    hex: '#537bc4',
    rgb: '83, 123, 196'
  },
  {
    hex: '#acc236',
    rgb: '172, 194, 54'
  },
  {
    hex: '#166a8f',
    rgb: '22, 106, 143'
  },
  {
    hex: '#00a950',
    rgb: '0, 169, 80'
  },
  {
    hex: '#58595b',
    rgb: '88, 89, 91'
  },
  {
    hex: '#8549ba',
    rgb: '133, 73, 186'
  }
];

export function colorHex(index:number) {
  return COLORS[index % COLORS.length].hex;
}

export function colorRgb(index:number, opacity:number=1) {
  const rgb = COLORS[index % COLORS.length].rgb
  return `rgba(${rgb}, ${opacity})`;
}