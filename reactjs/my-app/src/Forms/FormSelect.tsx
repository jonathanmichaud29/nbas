import { Controller, useFormContext } from "react-hook-form";
import { MenuItem, TextField } from "@mui/material";

interface IFormSelectOptions {
  value: any;
  label: string;
}

interface IFormSelectProps {
  label: string;
  controllerName: string;
  controllerKey?: string;
  optionKeyPrefix: string;
  options:IFormSelectOptions[];
  defaultOptions?: IFormSelectOptions[];
  isRequired?: boolean;
  fieldMinValue?: number;
  fieldMinValueMessage?: string;
  fieldMaxValue?: number;
  validateWatchNumber?: (value: number) => string | undefined;
}

function FormSelect(props: IFormSelectProps) {
  const { 
    label, controllerName, controllerKey, 
    isRequired, fieldMinValue, fieldMinValueMessage, fieldMaxValue, validateWatchNumber,
    options, defaultOptions, optionKeyPrefix } = props;
  const { control } = useFormContext();

  let listRules = {} as any;
  if( isRequired ){
    listRules.required = "Number required";
  }
  if( fieldMinValue !== undefined ) {
    listRules.min = {
      value: fieldMinValue,
      message: fieldMinValueMessage ? fieldMinValueMessage : `Number equal or greater than ${fieldMinValue}`
    }
  }
  if( fieldMaxValue !== undefined ) {
    listRules.max = {
      value: fieldMaxValue,
      message: `Number equal or lower than ${fieldMaxValue}`
    }
  }
  if( validateWatchNumber ) {
    listRules.validate = validateWatchNumber;
  }

  return (
    <Controller
      key={controllerKey}
      name={controllerName}
      control={control}
      rules={listRules}
      render={({ field: { onChange, value }, fieldState: { error }  }) => (
        <TextField
          select
          onChange={onChange} 
          value={value} 
          label={label}
          error={error ? true : false}
          helperText={error && error.message }
        >
          { defaultOptions && defaultOptions.map((option: IFormSelectOptions) => (
              <MenuItem key={`${optionKeyPrefix}${option.value}`} value={option.value}>{option.label}</MenuItem>
            )
          )}
          { options.map((option: IFormSelectOptions) => (
              <MenuItem key={`${optionKeyPrefix}${option.value}`} value={option.value}>{option.label}</MenuItem>
            )
          )}
        </TextField>
      )}
    />
  )
}

export default FormSelect;