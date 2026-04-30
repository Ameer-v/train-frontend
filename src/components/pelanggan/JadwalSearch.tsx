'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, InputAdornment, CircularProgress,
  Chip, Grid, Button,
} from '@mui/material';
import { Search, Train, ArrowForward, EventNote, AccessTime } from '@mui/icons-material';
import { apiFetch } from '@/lib/api';
import dayjs from 'dayjs';

const tf = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#4facfe' }, background: 'rgba(255,255,255,0.05)' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#4facfe' } },
};

interface Props { onSelectJadwal?: (jadwal: any) => void; }

export default function JadwalSearch({ onSelectJadwal }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchAsal, setSearchAsal] = useState('');
  const [searchTujuan, setSearchTujuan] = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await apiFetch('/jadwal'); setData(Array.isArray(r) ? r : []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = data.filter(d => {
    const matchAsal = !searchAsal || d.asal_keberangkatan?.toLowerCase().includes(searchAsal.toLowerCase());
    const matchTujuan = !searchTujuan || d.tujuan_keberangkatan?.toLowerCase().includes(searchTujuan.toLowerCase());
    return matchAsal && matchTujuan;
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20, mb: 1 }}>Cari Jadwal Kereta</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Temukan jadwal perjalanan yang sesuai</Typography>
      </Box>

      <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField fullWidth size="small" label="Kota Asal" value={searchAsal} onChange={e => setSearchAsal(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }} sx={tf} />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
              <ArrowForward sx={{ color: '#4facfe', fontSize: 24 }} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth size="small" label="Kota Tujuan" value={searchTujuan} onChange={e => setSearchTujuan(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }} sx={tf} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mb: 2 }}>{filtered.length} jadwal ditemukan</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={30} sx={{ color: '#4facfe' }} /></Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <EventNote sx={{ color: 'rgba(255,255,255,0.15)', fontSize: 64, mb: 2 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Tidak ada jadwal ditemukan</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(j => (
            <Card key={j.id} sx={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3,
              transition: 'all 0.2s', '&:hover': { borderColor: 'rgba(79,172,254,0.3)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'rgba(79,172,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Train sx={{ color: '#4facfe' }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{j.asal_keberangkatan}</Typography>
                          <ArrowForward sx={{ color: '#f5576c', fontSize: 16 }} />
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{j.tujuan_keberangkatan}</Typography>
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{j.kereta?.nama_kereta || `Kereta #${j.id_kereta}`}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }} />
                      <Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{dayjs(j.tanggal_berangkat).format('DD MMM YYYY')}</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{dayjs(j.tanggal_berangkat).format('HH:mm')} - {dayjs(j.tanggal_kedatangan).format('HH:mm')}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Chip label={j.kereta?.kelas || '-'} size="small" sx={{ background: 'rgba(240,147,251,0.15)', color: '#f093fb', fontWeight: 600, fontSize: 11 }} />
                    <Typography sx={{ color: '#43e97b', fontWeight: 800, fontSize: 18, mt: 0.5 }}>Rp {Number(j.harga).toLocaleString('id-ID')}</Typography>
                  </Grid>
                  <Grid item xs={6} md={2} sx={{ textAlign: 'right' }}>
                    <Button onClick={() => onSelectJadwal?.(j)}
                      sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { background: 'linear-gradient(135deg, #3d9ae6 0%, #00d4e0 100%)', transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
                      Pesan
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
