'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Train as TrainIcon,
  LockOutlined,
  PersonOutlined,
} from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError('Username dan password wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login gagal');

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);

      if (data.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/pelanggan');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative circles */}
      <Box sx={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)',
        top: -100, left: -100,
      }} />
      <Box sx={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)',
        bottom: -200, right: -200,
      }} />

      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          mx: 2,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                mb: 2,
                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.4)',
              }}
            >
              <TrainIcon sx={{ color: 'white', fontSize: 36 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: 'white',
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '-0.5px',
              }}
            >
              KA Citra
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, letterSpacing: 2, textTransform: 'uppercase', fontSize: 11 }}
            >
              Sistem Pemesanan Tiket
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              name="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
            />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword
                        ? <VisibilityOff sx={{ color: 'rgba(255,255,255,0.4)' }} />
                        : <Visibility sx={{ color: 'rgba(255,255,255,0.4)' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
            />

            <Button
              onClick={handleLogin}
              disabled={loading}
              fullWidth
              size="large"
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 0.5,
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e07de8 0%, #e04458 100%)',
                  boxShadow: '0 12px 28px rgba(245, 87, 108, 0.5)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Masuk'}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{ textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}
          >
            Belum punya akun?{' '}
            <Box
              component="span"
              onClick={() => router.push('/register')}
              sx={{ color: '#f5576c', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            >
              Daftar di sini
            </Box>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#f5576c' },
    background: 'rgba(255,255,255,0.05)',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.4)',
    '&.Mui-focused': { color: '#f5576c' },
  },
};
