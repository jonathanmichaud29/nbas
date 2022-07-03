
exports.dateFormatShort = (dateParam) => {
  const dateObject = new Date(dateParam)
  
  return dateObject.toLocaleDateString("en-CA",{ 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    timeZone: 'UTC'
  });
}