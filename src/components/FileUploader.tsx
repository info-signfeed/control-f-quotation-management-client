import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

// MUI
import { Box, List, ListItem, Avatar, Typography, IconButton, Button } from '@mui/material'

type FileUploaderProps = {
  value: File[] | undefined
  onChange: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
}

const FileUploader: React.FC<FileUploaderProps> = ({ value = [], onChange, maxFiles = 2, maxSizeMB = 2 }) => {
  const [files, setFiles] = useState<File[]>(value)

  useEffect(() => {
    onChange(files)
  }, [files])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    onDrop: acceptedFiles => setFiles(acceptedFiles),
    onDropRejected: () => {
      toast.error(`You can only upload ${maxFiles} file(s) & max size ${maxSizeMB} MB each.`, {
        autoClose: 3000
      })
    }
  })

  const handleRemoveFile = (file: File) => {
    setFiles(prev => prev.filter(f => f.name !== file.name))
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          padding: 4,
          textAlign: 'center',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          '&:hover': { borderColor: '#888' }
        }}
      >
        <input {...getInputProps()} />
        <Avatar variant='rounded' sx={{ mb: 1 }}>
          <i className='tabler-upload' />
        </Avatar>
        <Typography variant='body1' fontWeight={500}>
          Drop files here or click to upload
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          Allowed: .jpeg, .jpg, .png, .gif
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          Max {maxFiles} files and max size of {maxSizeMB} MB each
        </Typography>
      </Box>

      {files.length > 0 && (
        <Box mt={2}>
          <List>
            {files.map(file => (
              <ListItem key={file.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box display='flex' alignItems='center' gap={2}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={38}
                    height={38}
                    style={{ borderRadius: 4 }}
                  />
                  <Box>
                    <Typography>{file.name}</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      {file.size > 1000000
                        ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                        : `${(file.size / 1024).toFixed(1)} KB`}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => handleRemoveFile(file)}>
                  <i className='tabler-x' />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Box mt={1} display='flex' gap={2}>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default FileUploader
