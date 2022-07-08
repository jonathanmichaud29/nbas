import { KeyboardEvent, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Alert, Box, Button, Card, CardContent, CardHeader, Container, Grid } from "@mui/material";

import { logInWithEmailAndPassword } from "./firebase";

import FormTextInput from "../Forms/FormTextInput";

const defaultValues = {
  email: "",
  password: "",
};

interface IFormInput {
  email: string;
  password: string;
  apiError: string;
}

function Login() {
  
  const [apiError, changeApiError] = useState("");

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    
    logInWithEmailAndPassword(data.email, data.password)
      .then(userCredential => {
        changeApiError("");
      })
      .catch(error => {
        changeApiError(error);
      })
      .then(() =>{
        
      });
    
  } 

  const checkEnterSubmit = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Box p={3}>
      <Container maxWidth="xs">
        <Card>
          <CardHeader title="Login" component="h1" sx={{textAlign:"center"}} />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkEnterSubmit(e)}>
              <FormProvider {...methods}>
                <Grid container direction="column" alignItems="center" justifyContent="center">
                  <Grid item pb={3} >
                    <FormTextInput
                      label={`Email address`}
                      controllerName={`email`}
                      type="text"
                      isRequired={true}
                      pattern="email"
                    />
                  </Grid>
                  <Grid item pb={3}>
                    <FormTextInput
                      label={`Password`}
                      controllerName={`password`}
                      type="password"
                      isRequired={true}
                    />
                  </Grid>
                  <Grid item pb={3}>
                    <Button 
                      onClick={handleSubmit(onSubmit)}
                      variant="contained"
                      >Login</Button>
                  </Grid>
                  { apiError && (
                    <Grid item pb={3}>
                      <Alert severity="error">{apiError}</Alert>
                    </Grid> 
                  )}
                </Grid>    
              </FormProvider>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
export default Login;