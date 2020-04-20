import React from "react";
import { useForm, OnSubmit, FieldValues } from "react-hook-form";
import Select from "react-select";
import Input from "./Input";

export type Team = {
  id: string;
  name: string;
};

export type Feeder = {
  name: string;
  team_id: string;
  [x: string]: any;
};

export type FeederFormProps = {
  id?: string;
  onSubmit: OnSubmit<FieldValues>;
  teams: Team[];
  feeder?: Feeder;
};

export type OptionType = { label: string; value: string };

const FeederForm = ({
  id = "feeder_form",
  onSubmit,
  teams,
  feeder
}: FeederFormProps) => {
  const defaultValues = feeder || {
    name: "",
    team_id: teams[0].id
  };
  const { register, handleSubmit, setValue } = useForm({
    defaultValues
  });
  const options = teams.map(t => ({ label: t.name, value: t.id }));
  const [selectedOption, setSelectedOption] = React.useState(
    feeder ? options.find(t => t.value === feeder.team_id) : options[0]
  );
  React.useEffect(() => {
    register({ name: "team_id" });
  }, [register]);
  return (
    <form
      id={id}
      data-testid={id}
      onSubmit={handleSubmit(data => onSubmit({ ...feeder, ...data }))}
    >
      <Input
        id={`${id}-name`}
        name="name"
        label="Name"
        data-testid={`${id}-name`}
        register={register}
      />
      <Select
        classNamePrefix={`${id}-teams`}
        inputId={`${id}-teams`}
        value={selectedOption}
        options={options}
        onChange={(option: any) => {
          const value = (option as OptionType).value;
          setValue("team_id", value);
          setSelectedOption(option);
        }}
      />
    </form>
  );
};

export default FeederForm;
