import React from "react";
import { Stack, TextField } from "@mui/material";

interface AngleInputProps{
  changeAngle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AngleInput = ({ changeAngle }: AngleInputProps) => {

  function handleChangeAngle(event: React.ChangeEvent<HTMLInputElement>){
    changeAngle(event)
  } 


  return (
    <Stack>
      <TextField
        label="Angulo"
        variant="outlined"
        type="number"
        defaultValue={120}
        onChange={handleChangeAngle}
      />
    </Stack>
  );
};

export default AngleInput;
