import { useState }  from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Paper, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../redux/store";
import { addTeam } from "../redux/teamSlice";
import { createTeam } from '../ApiCall/teams';

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

  const dispatch = useDispatch<AppDispatch>();

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;

    setRequestStatus(true);
    reinitializeApiMessages();

    createTeam(data.name)
      .then((response) =>{
        reset()
        changeApiSuccess(response.message);
        dispatch(addTeam(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setRequestStatus(false);
      })
      
  }


  return (
    <div>
      <h3>Create new Team</h3>
      <Paper>
        { apiSuccess && <Alert security="success">{apiSuccess}</Alert> }
        { apiError && <Alert severity="error">{apiError}</Alert> }
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
                helperText={errors.name ? errors.name.message : '' }
              />
            )}
          />

          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            >Submit</Button>
      </Paper>
    </div>
  );
}

export default CreateTeam;