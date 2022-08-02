
export const patterns: any = {
  "email": {
    value: /\S+@\S+\.\S+/, 
    message: "Entered value does not match email format"
  },
  "datetime": {
    value: /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}\s(AM|PM)/gm, 
    message: "Entered datetime is invalid. It should be in the following format: YYYY-mm-dd HH:ii (AM|PM)"
  }
}