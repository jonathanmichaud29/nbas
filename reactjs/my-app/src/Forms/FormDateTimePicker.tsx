import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { TextField } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface IFormDateTimePickerProps {
  label: string;
  controllerName: string;
  callbackError: (error?: string) => void;
  controllerKey?: string;
  isRequired?: boolean;
  minDate?: Date;
  maxDate?: Date;
  inputFormat: string;
  minutesStep?: number;
  
}

function FormDateTimePicker(props: IFormDateTimePickerProps) {
  const { 
    label, controllerName, controllerKey, callbackError,
    isRequired, minDate, maxDate,
    inputFormat, minutesStep } = props;
  const { control } = useFormContext();

  const [currentError, setCurrentError] = useState<string | null>(null);
  const [errorDate, setErrorDate] = useState(false);

 
  let listRules = {} as any;
  if( isRequired ){
    listRules.required = "Datetime required";
  }

  return (
    <Controller
      name={controllerName}
      control={control}
      rules={listRules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>

            <DateTimePicker
              key={controllerKey}
              label={label}
              value={value}
              onChange={onChange}
              minutesStep={minutesStep}
              minDate={minDate}
              maxDate={maxDate}
              inputFormat={inputFormat}
              disableMaskedInput={false}
              onError={(reason, value) => {
                if (reason && value) {
                  callbackError(value);
                  setCurrentError(reason);
                  setErrorDate(true);
                } else {
                  callbackError();
                  setCurrentError(null);
                  setErrorDate(false);
                }
              }}
              renderInput={(params:any) => (
                <TextField 
                  {...params} 
                  error={!!error || errorDate}
                  helperText={(error && error.message) || ( currentError ?? currentError)}
                />
              )}
            />
          </LocalizationProvider>

        )}
      }
    />
  )
}

export default FormDateTimePicker;