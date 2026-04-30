'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, CircularProgress, Grid,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Train as TrainIcon,
  LockOutlined, PersonOutlined, Badge, Home, Phone,
} from '@mui/icons-material';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '', password: '', NIK: '',
    nama_penumpang: '', alamat: '', telp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async () => {
    if (!form.username || !form.password || !form.NIK || !form.nama_penumpang || !form.alamat || !form.telp) {
      setError('Semua field wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registrasi gagal');
      setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRegister();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: -100, left: -100 }} />
      <Box sx={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', bottom: -200, right: -200 }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', top: '50%', left: '60%' }} />

      <Card sx={{
        width: '100%', maxWidth: 520, mx: 2, borderRadius: 4,
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              mb: 2, boxShadow: '0 8px 20px rgba(245, 87, 108, 0.4)',
            }}>
              <TrainIcon sx={{ color: 'white', fontSize: 36 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', fontFamily: '"Playfair Display", serif', letterSpacing: '-0.5px' }}>
              Daftar Akun
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, letterSpacing: 2, textTransform: 'uppercase', fontSize: 11 }}>
              Buat Akun Pelanggan Baru
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField name="username" label="Username" value={form.username} onChange={handleChange} onKeyDown={handleKeyDown} fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlined sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }}
                  sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="password" label="Password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} onKeyDown={handleKeyDown} fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff sx={{ color: 'rgba(255,255,255,0.4)' }} /> : <Visibility sx={{ color: 'rgba(255,255,255,0.4)' }} />}</IconButton></InputAdornment>,
                  }}
                  sx={textFieldStyle} />
              </Grid>
            </Grid>
            <TextField name="NIK" label="NIK (16 digit)" value={form.NIK} onChange={handleChange} onKeyDown={handleKeyDown} fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><Badge sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }}
              sx={textFieldStyle} />
            <TextField name="nama_penumpang" label="Nama Lengkap" value={form.nama_penumpang} onChange={handleChange} onKeyDown={handleKeyDown} fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlined sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }}
              sx={textFieldStyle} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <TextField name="alamat" label="Alamat" value={form.alamat} onChange={handleChange} onKeyDown={handleKeyDown} fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><Home sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }}
                  sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField name="telp" label="No. Telepon" value={form.telp} onChange={handleChange} onKeyDown={handleKeyDown} fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }}
                  sx={textFieldStyle} />
              </Grid>
            </Grid>

            <Button onClick={handleRegister} disabled={loading} fullWidth size="large"
              sx={{
                mt: 1, py: 1.5, borderRadius: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white', fontWeight: 700, fontSize: 15, letterSpacing: 0.5,
                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #e07de8 0%, #e04458 100%)', boxShadow: '0 12px 28px rgba(245, 87, 108, 0.5)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s ease',
              }}>
              {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Daftar Sekarang'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            Sudah punya akun?{' '}
            <Box component="span" onClick={() => router.push('/login')}
              sx={{ color: '#f5576c', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
              Masuk di sini
            </Box>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, color: 'white',
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
