
/**
 * TODO: Change the timezone to the league localisation
 * @param argDate 
 * @returns
 */
const createDateReadable = (argDate: Date): string => {
  const dateObject = new Date(argDate)
  return dateObject.toLocaleDateString("en-CA",{ 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hourCycle:'h24', 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'America/Toronto'
  });
}

export {
  createDateReadable
}