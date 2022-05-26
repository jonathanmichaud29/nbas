const fetchTeams = async () => {
  return await fetch(`${process.env.REACT_APP_API_DOMAIN}/team/`)
    .then(res => res.json())
    .then(
      (data) => {
        return data.data
      },
      (error) => {
        return error
      }
  )
}

export { fetchTeams }