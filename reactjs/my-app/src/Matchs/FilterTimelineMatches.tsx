import { useEffect, useState } from "react"
import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"

import { IMatchTimeline } from "../Interfaces/match";

import { listMatchTimeline } from "../utils/constants";

interface IFilterTimetlineMatchesProps {
  cbSelectTimeline: ((matchTimeline: IMatchTimeline) => void)
}

export default function FilterTimelineMatches(props: IFilterTimetlineMatchesProps){
  
  const {cbSelectTimeline} = props;

  const defaultTimeline = listMatchTimeline[0];
  const [matchTimeline, setMatchTimeline] = useState<IMatchTimeline>(defaultTimeline);
  
  const handleTimeline = (event: React.MouseEvent<HTMLElement>, newTimeline: string) => {
    setMatchTimeline(listMatchTimeline.find((item) => newTimeline === item.key) || defaultTimeline)
  }

  useEffect(() => {
    cbSelectTimeline(matchTimeline)
  },[cbSelectTimeline, matchTimeline])

  return (
    <Paper
      elevation={3}
      component={Box}
      square={true}
      variant="outlined"
      mb={2} p={2} 
    >
      <Stack direction='row' spacing={1} alignItems='center'
      >
        <Typography pl={2}>Matches</Typography>
        <ToggleButtonGroup
          exclusive={true}
          value={matchTimeline.key}
          onChange={handleTimeline}
          aria-label="Filter Match Timeline"
          color="primary"
        >
          { listMatchTimeline.map((item) => {
            return (
              <ToggleButton key={`timeline-${item.key}`} 
                size="small"
                value={item.key}
              >{item.label}</ToggleButton>
            )
          })}
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  )
}