import React, { useEffect, useState } from "react";
import {
  Stack,
  TextField,
  Switch,
  Box,
  boxClasses,
  FormControlLabel,
} from "@mui/material";
import { Draw } from "@/Entities/Draw";

interface AngleInputProps {
  changeAngle: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    id: number
  ) => number;
}

const AngleInput = ({ changeAngle }: AngleInputProps) => {
  //



  const [id, setId] = useState(6);
  const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(Number(event.target.value))
  }

  //Switch do Angulo
  const [checked, setChecked] = useState(false);
  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    // SwitchMoveRightSide(draw)
  };

  function handleChangeAngle(event: React.ChangeEvent<HTMLInputElement>) {
    changeAngle(event, checked, id);
  }

  return (
    <Stack>
      <Stack>
        <TextField label='id' type="number" defaultValue={6} onChange={handleChangeId} />
      </Stack>
      <Box>
        <FormControlLabel
          label="Trocar Sentido"
          control={<Switch checked={checked} onChange={handleChangeSwitch} />}
        ></FormControlLabel>
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
