'use client'

import React from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { Box, Typography } from '@mui/material'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  label?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label }) => {
  return (
    <Box display='flex' flexDirection='column' gap={1}>
      {label && (
        <Typography variant='subtitle2' mb={1}>
          {label}
        </Typography>
      )}
      <ReactQuill
        theme='snow'
        value={value}
        onChange={onChange}
        placeholder='Enter description...'
        style={{ borderRadius: '8px' }}
      />
    </Box>
  )
}

export default RichTextEditor
