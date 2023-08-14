
export const replaceSeasonLink = (link: string, replacement:string) => {
  return link.replace(':idSeason', replacement);
}