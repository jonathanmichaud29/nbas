
exports.dateFormatShort = (dateParam) => {
  const dateObject = new Date(dateParam)
  
  return dateObject.toLocaleDateString("en-CA",{ 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    timeZone: 'UTC'
  });
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

exports.dateFormatToDatabase = (dateParam) => {
  const utcString = dateParam.toUTCString();
  return formatDate(new Date(utcString));
}