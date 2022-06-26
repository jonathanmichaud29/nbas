import { KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { auth, logInWithEmailAndPassword } from "./firebase";
import { Alert, Box, Button } from "@mui/material";

import FormTextInput from "../Forms/FormTextInput";

import './_login.scss';

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
        userCredential.user.getIdToken().then(token=>{
          window.localStorage.setItem('userToken', token);
        });
        
      })
      .catch(error => {
        changeApiError(error);
      })
      .then(() =>{
        
      });
    
  } 

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/admin/dashboard");
  }, [user, loading, navigate]);

  const checkEnterSubmit = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Box className="form formLogin">
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkEnterSubmit(e)}>
        <FormProvider {...methods}>
          <FormTextInput
            label={`Email address`}
            controllerName={`email`}
            type="text"
            isRequired={true}
            pattern="email"
          />
          <FormTextInput
            label={`Password`}
            controllerName={`password`}
            type="password"
            isRequired={true}
          />
          
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            >Login</Button>

          { apiError && <Alert severity="error">{apiError}</Alert> }
        </FormProvider>
      </form>
    </Box>
  );
}
export default Login;