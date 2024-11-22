import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  TextField,
  Switch,
  Box,
  boxClasses,
  FormControlLabel,
} from "@mui/material";
import { Draw } from "@/Entities/Draw";
import { DoublyLinkedList } from "@/Entities/BaseStructures/DoublyLinkedList";

interface AngleInputProps {
  changeAngle: (
    checked: boolean,
    id: number,
    value: number
  ) => number;
  draw: DrawAreaProps;
}

export interface DrawAreaProps {
  name: string;
  code: string;
  lines: DoublyLinkedList<Draw>;
  setLines: (lines: DoublyLinkedList<Draw>) => void;
}

const AngleInput = ({ changeAngle, draw }: AngleInputProps) => {
  //

  const [id, setId] = useState(6);
  const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(Number(event.target.value));
  };

  const updateValueById = useCallback(() => {
    setValue(Number(draw.lines.search(id)?.data.angleToNextPoint));
  }, [id]);

  useEffect(() => {
    updateValueById();
  }, [id]);

  //Switch do Angulo
  const [checked, setChecked] = useState(false);
  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  function handleChangeAngle() {
    changeAngle(checked, id, value);
  }

  // Ao determinar o valor aqui dentro
  // eu deixo de precisar o event nas funções de changeAngle
  // consigo passar o valor do angulo como parametro e isolo o event para esse propósito.
  const [value, setValue] = useState(120);
  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  useEffect(() => {
    handleChangeAngle()
  }, [value])
  



  return (
    <Stack>
      <Box>
        <FormControlLabel
          label="Trocar Sentido"
          control={<Switch checked={checked} onChange={handleChangeSwitch} />}
        ></FormControlLabel>
      </Box>

      <Stack direction="row" spacing={2}>
        <TextField
          label="id"
          type="number"
          defaultValue={6}
          onChange={handleChangeId}
        />

        <TextField
          label="Angulo"
          variant="outlined"
          type="number"
          value={value}
          onChange={handleChangeValue}
        />
      </Stack>
    </Stack>
  );
};

export default AngleInput;
