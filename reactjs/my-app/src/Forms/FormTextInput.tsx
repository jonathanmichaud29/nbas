import { Controller, useFormContext } from "react-hook-form";

import { TextField } from "@mui/material";

import { patterns } from '../utils/validation';

interface IFormTextInputProps {
  label: string;
  controllerName: string;
  type: string;
  controllerKey?: string;
  isRequired?: boolean;
  pattern?: string;
}

function FormTextInput(props: IFormTextInputProps) {
  const { label, controllerName, controllerKey, type, isRequired, pattern } = props;
  const { control } = useFormContext();

  let listRules = {} as any;
  if( isRequired ){
    listRules.required = "This field is required";
  }
  if( pattern && pattern in patterns ){
    listRules.pattern = patterns[pattern];
  }

  return (
    <Controller
      key={controllerKey}
      name={controllerName}
      control={control}
      rules={listRules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField 
          onChange={onChange} 
          value={value} 
          type={type}
          label={label} 
          error={error ? true : false}
          helperText={error && error.message }
        />
      )}
    />
  )
}

export default FormTextInput;