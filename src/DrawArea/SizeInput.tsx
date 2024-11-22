import { DoublyLinkedList } from '@/Entities/BaseStructures/DoublyLinkedList';
import { Draw } from '@/Entities/Draw';
import { Stack, stackClasses, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
export interface DrawAreaProps {
  name: string;
  code: string;
  lines: DoublyLinkedList<Draw>;
  setLines: (lines: DoublyLinkedList<Draw>) => void;
}

interface SizeInputProps {
  changeSize: (
    id: number,
    value: number
  ) => void;
  draw: DrawAreaProps;
}


const SizeInput = ({changeSize, draw}: SizeInputProps) => {
  const [value, setValue] = useState(5)
  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const [id, setId] = useState(2);
  const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(Number(event.target.value));
  };

  function handleChangeSize() {
    changeSize(id, value)
  }

  useEffect(() => {
    handleChangeSize()
  }, [value])
  
  // Função em comum com Angle Input(um é para angulo outro é para data.size)
  //--------------------------------------------------
  const updateValueById = useCallback(() => {
    setValue(Number(draw.lines.search(id)?.data.size));
  }, [id]);

  useEffect(() => {
    updateValueById();
  }, [id]);
  //--------------------------------------------------


  return (
    <Stack>
       <TextField
          label="id"
          type="number"
          value={id}
          onChange={handleChangeId}
        />
      <TextField
            label="Tamanho"
            variant="outlined"
            type="number"
            value={value}
            onChange={handleChangeValue}
          />

    </Stack>
  )
}

export default SizeInput