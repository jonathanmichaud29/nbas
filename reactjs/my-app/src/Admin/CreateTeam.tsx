import { useState, useEffect }  from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Paper, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addTeam } from "../redux/teamSlice";
import { createTeam, fetchTeam } from '../ApiCall/teams';

const defaultValues = {
  name: ""
}

interface IFormInput {
  name: string;
}

function CreateTeam() {
  
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);
  const [newTeamId, setNewTeamId] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const listTeams = useSelector((state: RootState) => state ).teams
  console.info(listTeams);

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;
    setRequestStatus(true);
    changeApiSuccess("");
    createTeam(data.name)
      .then((response) =>{
        changeApiError("");
        reset()
        changeApiSuccess(response.message);
        setNewTeamId(response.data.id)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setRequestStatus(false);
      })
      
  }

  useEffect(() => {
    if( newTeamId !== 0 ){
      fetchTeam(newTeamId)
        .then(response => {
          dispatch(addTeam(response.data));
        })
        .catch(error => {
          changeApiError(error);
        })
        .finally(() => {
          // something finally ended
          setNewTeamId(0);
        });
    }
  }, [dispatch, newTeamId])

  return (
    <div>
      <h3>Create new Team</h3>
      <Paper>
        {apiSuccess &&
            <div className="success">{apiSuccess}</div>
          }
        <Controller
            name={"name"}
            control={control}
            rules={{ 
              required: "This is required",
            }}
            render={({ field: { onChange, value } }) => (
              <TextField 
                onChange={onChange} 
                value={value} 
                label={"Team Name"} 
                error={errors.name ? true : false}
              />
            )}
          />
          {errors.name && <span role="alert">{errors.name.message}</span>}

          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            >Submit</Button>
          {apiError &&
            <div className="alert alert-danger mt-3 mb-0">{apiError}</div>
          }
      </Paper>
    </div>
  );
}

export default CreateTeam;