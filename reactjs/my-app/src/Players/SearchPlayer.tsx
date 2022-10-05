import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormTextInput from "../Forms/FormTextInput";

interface ISearchPlayerProps {
  onChangeName: (name:string) => void
}

interface IFormInput {
  searchName: string;
}

export default function SearchPlayer(props:ISearchPlayerProps) {
  const {onChangeName} = props;

  const defaultValues = {
    searchName: "",
  }
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const {getValues, watch} = methods;
  const watchName = watch("searchName");

  useEffect(() => {
    onChangeName(getValues("searchName"));
  }, [watchName, onChangeName, getValues])

  return (
    <FormProvider {...methods}>
      <FormTextInput
        controllerName="searchName"
        label="Search Player Name"
        type="text"

      />
    </FormProvider>
  )
}