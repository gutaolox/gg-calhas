import React, { useEffect, useState } from "react";
import { Stack, TextField, Switch, Box, boxClasses, FormControlLabel } from "@mui/material";

interface AngleInputProps{
  changeAngle: (event: React.ChangeEvent<HTMLInputElement>, sentido: boolean) => number;
}

const AngleInput = ({ changeAngle }: AngleInputProps) => {
  //Switch do Angulo
  const [checked, setChecked] = useState(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }


  function handleChangeAngle(event: React.ChangeEvent<HTMLInputElement>){
    changeAngle(event, checked)
  } 

 
  return (
    <Stack>
      <Box>
        <FormControlLabel label='Trocar Sentido' control={<Switch checked={checked} onChange={handleChange}/>}></FormControlLabel>
      </Box>
      <Stack>   
        <TextField
          label="Angulo"
          variant="outlined"
          type="number"
          defaultValue={120}
          onChange={handleChangeAngle}
        />
      </Stack>
    </Stack>
  );
};

export default AngleInput;
