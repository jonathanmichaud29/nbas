import { KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Alert, Box, Button, Card, CardContent, CardHeader, Container, Grid } from "@mui/material";

import { auth, logInWithEmailAndPassword } from "./firebase";
import { IApiSetUserFirebaseTokenParams, setUserFirebaseToken } from "../ApiCall/users";

import FormTextInput from "../Forms/FormTextInput";

import { updateAxiosBearer } from "../utils/axios";

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
  
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (loading) return;
    if (user) {
      user.getIdToken().then(token=>{
        window.localStorage.setItem('userToken', token);
        const paramsSetUserFirebaseToken: IApiSetUserFirebaseTokenParams = {
          email: user.email || '',
          token: token,
        }
        setUserFirebaseToken(paramsSetUserFirebaseToken)
          .then(response => {
            updateAxiosBearer()
            navigate("/admin/dashboard");
          })
      })
      
      
    }
  }, [user, loading, navigate]);

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