'use client';

import React from 'react';
import { CssBaseline } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

export default function data() {
  const [data, setData] = useState();

  const onClickHandle = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/aws-response'
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  return (
    <div>
      <CssBaseline />
      data
      <button className='aws-button' onClick={onClickHandle}>
        Analyze Data
      </button>
      <p>{data}</p>
    </div>
  );
}
