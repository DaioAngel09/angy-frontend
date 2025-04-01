import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const LoginPage = () => {
  const handleLogin = () => {
    // Lógica de autenticação
    console.log('Login realizado');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4" mb={2}>
        Bem-vindo ao Angy
      </Typography>
      <TextField label="Usuário" variant="outlined" margin="normal" fullWidth />
      <TextField
        label="Senha"
        type="password"
        variant="outlined"
        margin="normal"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;