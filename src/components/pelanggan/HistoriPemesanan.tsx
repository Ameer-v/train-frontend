'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, CircularProgress,
  Chip, Grid, MenuItem, Dialog, DialogTitle, DialogContent, IconButton, Divider,
} from '@mui/material';
import { History, Close, ArrowForward, Train, ConfirmationNumber, Receipt } from '@mui/icons-material';
import { apiFetch } from '@/lib/api';
import dayjs from 'dayjs';

const cs = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 };
const tf = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#4facfe' }, background: 'rgba(255,255,255,0.05)' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#4facfe' } },
};

const months = ['', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const monthNames = ['Semua Bulan', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function HistoriPemesanan() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));
  const [detail, setDetail] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      let url = '/pembelian-tiket/histori';
      const params: string[] = [];
      if (bulan) params.push(`bulan=${bulan}`);
      if (tahun) params.push(`tahun=${tahun}`);
      if (params.length) url += `?${params.join('&')}`;
      const r = await apiFetch(url);
      setData(Array.isArray(r) ? r : []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [bulan, tahun]);

  const viewDetail = async (id: number) => {
    try { const r = await apiFetch(`/pembelian-tiket/${id}`); setDetail(r); } catch {}
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Histori Pemesanan</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{data.length} tiket ditemukan</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField size="small" label="Bulan" value={bulan} onChange={e => setBulan(e.target.value)} select sx={{ ...tf, minWidth: 140 }}>
            {months.map((m, i) => <MenuItem key={i} value={m}>{monthNames[i]}</MenuItem>)}
          </TextField>
          <TextField size="small" label="Tahun" value={tahun} onChange={e => setTahun(e.target.value)} sx={{ ...tf, minWidth: 100 }} />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={30} sx={{ color: '#4facfe' }} /></Box>
      ) : data.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <History sx={{ color: 'rgba(255,255,255,0.15)', fontSize: 64, mb: 2 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Belum ada riwayat pemesanan</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.map(item => (
            <Card key={item.id} onClick={() => viewDetail(item.id)} sx={{
              ...cs, cursor: 'pointer', transition: 'all 0.2s',
              '&:hover': { borderColor: 'rgba(79,172,254,0.3)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={1}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'rgba(79,172,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ConfirmationNumber sx={{ color: '#4facfe' }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{item.jadwal?.asal_keberangkatan || '-'}</Typography>
                      <ArrowForward sx={{ color: '#f5576c', fontSize: 14 }} />
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{item.jadwal?.tujuan_keberangkatan || '-'}</Typography>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      {item.jadwal?.tanggal_berangkat ? dayjs(item.jadwal.tanggal_berangkat).format('DD MMM YYYY HH:mm') : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Tanggal Pesan</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}>
                      {item.tanggal_pembelian ? dayjs(item.tanggal_pembelian).format('DD MMM YYYY') : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Chip label={`${item.detail_penumpang?.length || item.jumlah_penumpang || 1} Penumpang`} size="small" sx={{ background: 'rgba(240,147,251,0.15)', color: '#f093fb', fontWeight: 600, fontSize: 11 }} />
                  </Grid>
                  <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#43e97b', fontWeight: 800, fontSize: 18 }}>
                      Rp {Number(item.total_harga || item.jadwal?.harga || 0).toLocaleString('id-ID')}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Receipt sx={{ color: '#4facfe' }} /> Tiket #{detail?.id}</Box>
          <IconButton onClick={() => setDetail(null)} sx={{ color: 'rgba(255,255,255,0.4)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {detail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card sx={{ ...cs, p: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>Informasi Perjalanan</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Train sx={{ color: '#4facfe', fontSize: 20 }} />
                  <Typography sx={{ color: 'white', fontWeight: 700 }}>{detail.jadwal?.asal_keberangkatan}</Typography>
                  <ArrowForward sx={{ color: '#f5576c', fontSize: 16 }} />
                  <Typography sx={{ color: 'white', fontWeight: 700 }}>{detail.jadwal?.tujuan_keberangkatan}</Typography>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Berangkat: {dayjs(detail.jadwal?.tanggal_berangkat).format('DD MMM YYYY HH:mm')}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Tiba: {dayjs(detail.jadwal?.tanggal_kedatangan).format('DD MMM YYYY HH:mm')}</Typography>
              </Card>
              <Card sx={{ ...cs, p: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>Penumpang</Typography>
                {detail.detail_penumpang?.map((p: any, i: number) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography sx={{ color: 'white', fontSize: 13 }}>{p.nama_penumpang} ({p.NIK})</Typography>
                    <Chip label={`Kursi ${p.kursi?.no_kursi || p.id_kursi}`} size="small" sx={{ background: 'rgba(79,172,254,0.15)', color: '#4facfe', fontSize: 10 }} />
                  </Box>
                ))}
              </Card>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Total Pembayaran</Typography>
                <Typography sx={{ color: '#43e97b', fontWeight: 800, fontSize: 20 }}>Rp {Number(detail.total_harga || 0).toLocaleString('id-ID')}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
