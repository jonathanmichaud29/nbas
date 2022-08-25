import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

interface IFormNumberInputProps {
  label: string;
  controllerName: string;
  controllerKey?: string;
  isRequired?: boolean;
  fieldMinValue?: number;
  fieldMaxValue?: number;
}

function FormNumberInput(props: IFormNumberInputProps) {
  const { label, controllerName, controllerKey, isRequired, fieldMinValue, fieldMaxValue } = props;
  const { control } = useFormContext();

  let listRules = {} as any;
  if( isRequired ){
    listRules.required = "Number required";
  }
  if( fieldMinValue !== undefined ) {
    listRules.min = {
      value: fieldMinValue,
      message: `Number equal or greater than ${fieldMinValue}`
    }
  }
  if( fieldMaxValue !== undefined ) {
    listRules.max = {
      value: fieldMaxValue,
      message: `Number equal or lower than ${fieldMaxValue}`
    }
  }

  return (
    <Controller
      key={controllerKey}
      name={controllerName}
      control={control}
      rules={listRules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField 
          size="small"
          onChange={onChange} 
          value={value} 
          type="number"
          label={label} 
          error={error ? true : false}
          helperText={error && error.message }
        />
      )}
    />
  )
}

export default FormNumberInput;