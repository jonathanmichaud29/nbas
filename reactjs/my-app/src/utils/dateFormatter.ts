
/**
 * TODO: Change the timezone to the league localisation
 * @param argDate 
 * @returns
 */
export const createDateReadable = (argDate: Date): string => {
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

const dayOfWeekLabel = (argDate: Date): string => {
  const listValues = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  return listValues[argDate.getDay()];
}

const monthOfYearLabel = (argDate: Date): string => {
  const listValues = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return listValues[argDate.getMonth()];
}

export const createHumanDate = (argDate: Date): string => {
  const dateObject = new Date(argDate);
  /* const dayLabel = dayOfWeekLabel(dateObject); */
  const monthLabel = monthOfYearLabel(dateObject);

  const dateReturn = dateObject.getFullYear() + ", " + monthLabel + " " + dateObject.getDate() + " @ " + 
    dateObject.getHours().toString().padStart(2, '0') + ":" + dateObject.getMinutes().toString().padStart(2, '0');

  return dateReturn;
}

export const extractCalendarDay = (argDate: Date): string => {
  const dateObject = new Date(argDate);
  const monthLabel = monthOfYearLabel(dateObject);

  const dateReturn = dateObject.getFullYear() + ", " + monthLabel + " " + dateObject.getDate();

  return dateReturn;
}

export const extractHourFromDate = (argDate: Date): string => {
  const dateObject = new Date(argDate);
  const dateReturn = dateObject.getHours().toString().padStart(2, '0') + ":" + dateObject.getMinutes().toString().padStart(2, '0');
  return dateReturn;
}

export const createShortDateReadable = (argDate: Date): string => {
  const dateObject = new Date(argDate)
  return dateObject.toLocaleDateString("en-CA",{ 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    timeZone: 'America/Toronto'
  });
}