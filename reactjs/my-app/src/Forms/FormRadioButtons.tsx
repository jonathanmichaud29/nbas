import { Controller, useFormContext } from "react-hook-form";
import { FormControlLabel, FormHelperText, Radio, RadioGroup } from "@mui/material";
import { IFieldPlayerExistsActions } from '../Interfaces/forms';

interface IFormRadioButtonsProps {
  controllerName: string;
  listValues: IFieldPlayerExistsActions[];
  isRequired?: boolean;
}


function FormRadioButtons(props: IFormRadioButtonsProps) {
  const { controllerName, listValues, isRequired } = props;
  const { control } = useFormContext();

  let listRules = {} as any;
  if( isRequired ){
    listRules.required = "This field is required";
  }
  /* if( pattern && pattern in patterns ){
    listRules.pattern = patterns[pattern];
  } */

  return (
    <Controller
      name={controllerName}
      control={control}
      rules={listRules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <RadioGroup value={value} onChange={onChange}>
          {error?.message ? <FormHelperText error={true}>Please select an option</FormHelperText> : ''}
          { listValues.map((listValue) => {
            return (
              <FormControlLabel 
                key={`${controllerName}-${listValue.value}`}
                value={listValue.value}
                label={listValue.label} 
                control={<Radio />}
              />
            )
          })}
        </RadioGroup>
      )}
    />
  )
}

export default FormRadioButtons;