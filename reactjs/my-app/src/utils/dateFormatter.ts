
const createDateReadable = (argDate: Date) => {
  const dateObject = new Date(argDate)
  return dateObject.toLocaleDateString("en-CA",{ 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hourCycle:'h24', 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'UTC'
  });
}

export {
  createDateReadable
}