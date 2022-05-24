import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { auth, logInWithEmailAndPassword } from "./firebase";
import { Paper, Button, TextField } from "@mui/material";


const defaultValues = {
  email: "",
  password: "",
};

interface IFormInput {
  email: string;
  password: string;
}

function Login() {
  
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    logInWithEmailAndPassword(data.email, data.password)
  } 

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/admin/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="login">
      <Paper>
        <Controller
          name={"email"}
          control={control}
          rules={{ 
            required: "This is required",
            pattern:{ 
              value: /\S+@\S+\.\S+/, 
              message: "Entered value does not match email format"
            } 
          }}
          render={({ field: { onChange, value } }) => (
            <TextField 
              onChange={onChange} 
              value={value} 
              label={"Email address"} 
              error={errors.email ? true : false}
            />
          )}
        />
        {errors.email && <span role="alert">{errors.email.message}</span>}
        <Controller
          name={"password"}
          control={control}
          rules={{ 
            required: "The password is required",
          }}
          render={({ field: { onChange, value } }) => (
            <TextField 
              onChange={onChange} 
              value={value} 
              label={"Password"} 
              type="password" 
              error={errors.password ? true : false}
              helperText={errors.password && errors.password.message}
            />
          )}
        />
        {errors.password && <span role="alert">{errors.password.message}</span>}
        <Button 
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          >Submit</Button>
      </Paper>
    </div>
  );
}
export default Login;