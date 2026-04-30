'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Chip, InputAdornment, CircularProgress, Grid,
  MenuItem, Dialog, DialogTitle, DialogContent, IconButton, Divider,
} from '@mui/material';
import { Search, ConfirmationNumber, Close, ArrowForward, Receipt } from '@mui/icons-material';
import { apiFetch } from '@/lib/api';
import dayjs from 'dayjs';

const cs = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 };
const tf = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#f5576c' }, background: 'rgba(255,255,255,0.05)' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#f5576c' } },
};
const hc = { color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600 };
const bc = { borderBottom: '1px solid rgba(255,255,255,0.04)' };

const months = ['', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const monthNames = ['Semua Bulan', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function TransaksiManagement() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));
  const [detail, setDetail] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      let url = '/pembelian-tiket';
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
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Histori Transaksi</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{data.length} transaksi ditemukan</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" label="Bulan" value={bulan} onChange={e => setBulan(e.target.value)} select sx={{ ...tf, minWidth: 140 }}>
            {months.map((m, i) => <MenuItem key={i} value={m}>{monthNames[i]}</MenuItem>)}
          </TextField>
          <TextField size="small" label="Tahun" value={tahun} onChange={e => setTahun(e.target.value)} sx={{ ...tf, minWidth: 100 }} />
        </Box>
      </Box>
      <Card sx={cs}>
        <TableContainer><Table>
          <TableHead><TableRow>
            <TableCell sx={hc}>ID</TableCell><TableCell sx={hc}>Pelanggan</TableCell><TableCell sx={hc}>Rute</TableCell><TableCell sx={hc}>Tanggal</TableCell><TableCell sx={hc}>Jumlah Penumpang</TableCell><TableCell sx={hc}>Total</TableCell><TableCell sx={hc} align="right">Detail</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={7} align="center" sx={{ borderBottom: 'none', py: 6 }}><CircularProgress size={30} sx={{ color: '#f5576c' }} /></TableCell></TableRow>
            : data.length === 0 ? <TableRow><TableCell colSpan={7} align="center" sx={{ color: 'rgba(255,255,255,0.3)', borderBottom: 'none', py: 6 }}>Tidak ada transaksi</TableCell></TableRow>
            : data.map(item => (
              <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' }, cursor: 'pointer' }} onClick={() => viewDetail(item.id)}>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)' }}>{item.id}</TableCell>
                <TableCell sx={bc}><Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{item.pelanggan?.nama_penumpang || item.user?.username || '-'}</Typography></TableCell>
                <TableCell sx={bc}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.jadwal?.asal_keberangkatan || '-'}</Typography>
                  <ArrowForward sx={{ color: '#f5576c', fontSize: 12 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.jadwal?.tujuan_keberangkatan || '-'}</Typography>
                </Box></TableCell>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{item.tanggal_pembelian ? dayjs(item.tanggal_pembelian).format('DD MMM YYYY HH:mm') : '-'}</TableCell>
                <TableCell sx={bc}><Chip label={`${item.detail_penumpang?.length || item.jumlah_penumpang || '-'} orang`} size="small" sx={{ background: 'rgba(79,172,254,0.15)', color: '#4facfe', fontWeight: 600, fontSize: 11 }} /></TableCell>
                <TableCell sx={bc}><Chip label={`Rp ${Number(item.total_harga || item.jadwal?.harga || 0).toLocaleString('id-ID')}`} size="small" sx={{ background: 'rgba(67,233,123,0.15)', color: '#43e97b', fontWeight: 600, fontSize: 11 }} /></TableCell>
                <TableCell align="right" sx={bc}><IconButton size="small" sx={{ color: '#4facfe' }}><Receipt fontSize="small" /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></TableContainer>
      </Card>

      <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
          Detail Tiket #{detail?.id}<IconButton onClick={() => setDetail(null)} sx={{ color: 'rgba(255,255,255,0.4)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {detail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card sx={{ ...cs, p: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>Informasi Perjalanan</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
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
