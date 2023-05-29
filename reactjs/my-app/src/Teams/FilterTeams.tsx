import { useEffect, useState } from "react";

import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Paper, Stack, Switch } from "@mui/material";

import { ITeam } from "../Interfaces/team";


interface IFilterTeamsProps {
  teams: ITeam[];
  cbSelectTeams: ((activeFilter: boolean, teams: ITeam[]) => void)
}

export default function FilterTeams(props: IFilterTeamsProps){
  const { teams, cbSelectTeams } = props;

  const [activeFilter, setActiveFilter] = useState<boolean>(false);
  const [selectedTeams, setSelectedTeams] = useState<ITeam[]>([]);
  
  const listTeamIds = selectedTeams.map((team) => team.id)
  
  const handleTeamCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const teamEvent: ITeam = JSON.parse(event.target.value) as ITeam;
    
    if( event.target.checked ) {
      const newTeams = selectedTeams.concat([teamEvent]);
      setSelectedTeams(newTeams);
    }
    else {
      setSelectedTeams(selectedTeams.filter((team) => team.id !== teamEvent.id))
    }
  }

  const handleActiveFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveFilter(event.target.checked);
  }
    

  useEffect(() => {
    cbSelectTeams(activeFilter, selectedTeams)
  }, [activeFilter, cbSelectTeams, selectedTeams]);
  

  return (
    <Paper
      component={Box}
      square={true}
      variant="outlined"
      p={1} 
    >
      <Stack direction={{xs:'column', sm:'row'}} alignItems='flex-start' flexWrap='wrap'>
        <FormControlLabel 
          label="Select Teams"
          labelPlacement="start"
          sx={{
            marginLeft:0,
            marginRight:3
          }}
          control={
            <Switch 
              checked={activeFilter} 
              onChange={handleActiveFilter}
            />
            }
        />
        { activeFilter 
        ? 
              <FormGroup row >
                {teams.map((team) => {
                  const isChecked = listTeamIds.includes(team.id)
                  return (
                    <FormControlLabel key={`team-${team.id}`} 
                      label={team.name}
                      control={
                        <Checkbox 
                          checked={isChecked}
                          value={JSON.stringify(team)}
                          onChange={handleTeamCheck}
                        />
                      }  />
                  )
                })}
              </FormGroup>
        : '' }
      </Stack>
    </Paper>
  )
}