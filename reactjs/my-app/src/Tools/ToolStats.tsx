import { useEffect, useState } from "react";
import { Paper, Box, Stack, Typography } from "@mui/material";
import { batch } from "react-redux";

import { usePublicContext } from "../Public/PublicApp";

import { IMatchLineup } from "../Interfaces/match";

import { IApiFetchMatchLineups, fetchMatchLineups } from "../ApiCall/matches";

import ToolComparePlayers from "./ToolComparePlayers";
import ToolCompareTeams from "./ToolCompareTeams";
import { ICompareCategory } from "./ToolCategoryCompare";
import LoaderInfo from "../Generic/LoaderInfo";


interface IToolStatsProps{
  category:ICompareCategory;
}

export default function ToolStats(props: IToolStatsProps){
  
  const { category } = props;

  const { leagueSeason } = usePublicContext();

  const [apiError, changeApiError] = useState<string>('');
  const [matchesLineups, setMatchesLineups] = useState<IMatchLineup[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    let newError: string = '';
    let newMatchesLineups: IMatchLineup[] = []
    const paramsMatchLineups: IApiFetchMatchLineups = {
      leagueSeasonIds:[leagueSeason.id]
    }
    fetchMatchLineups(paramsMatchLineups)
      .then((response) => {
        newMatchesLineups = response.data || [];
      })
      .catch((error) => {
        newError = error;
      })
      .finally(() => {
        batch(() => {
          setMatchesLineups(newMatchesLineups);
          changeApiError(newError);
          setDataLoaded(true);
        })
      })
  },[leagueSeason.id])
  
  return (
    <>
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      <Paper component={Box} p={3} m={3}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h1">Add new {category} statistic</Typography>
          
          
          { dataLoaded && category === "player" 
          ?
            <ToolComparePlayers 
              matchesLineups={matchesLineups}
            />
          : ''}

          { dataLoaded && category === "team" 
          ?
            <ToolCompareTeams 
              matchesLineups={matchesLineups}
            />
          : ''}
          
        </Stack>
      </Paper>
    </>
  )
}
