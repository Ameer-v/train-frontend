'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert, Chip, Tooltip, InputAdornment,
  CircularProgress, MenuItem, Grid,
} from '@mui/material';
import { Add, Edit, Delete, Search, EventNote, Close, ArrowForward } from '@mui/icons-material';
import { apiFetch } from '@/lib/api';
import dayjs from 'dayjs';

const cs = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 };
const tf = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#f5576c' }, background: 'rgba(255,255,255,0.05)' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#f5576c' } },
};
const hc = { color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600 };
const bc = { borderBottom: '1px solid rgba(255,255,255,0.04)' };
const dp = { background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 };
const gb = { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #e07de8 0%, #e04458 100%)' } };

export default function JadwalManagement() {
  const [data, setData] = useState<any[]>([]);
  const [keretaList, setKeretaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ asal_keberangkatan: '', tujuan_keberangkatan: '', tanggal_berangkat: '', tanggal_kedatangan: '', harga: '', id_kereta: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' as 'success' | 'error' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [j, k] = await Promise.all([apiFetch('/jadwal'), apiFetch('/kereta')]);
      setData(Array.isArray(j) ? j : []);
      setKeretaList(Array.isArray(k) ? k : []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleOpen = (item?: any) => {
    if (item) {
      setEditItem(item);
      setForm({
        asal_keberangkatan: item.asal_keberangkatan, tujuan_keberangkatan: item.tujuan_keberangkatan,
        tanggal_berangkat: dayjs(item.tanggal_berangkat).format('YYYY-MM-DDTHH:mm'),
        tanggal_kedatangan: dayjs(item.tanggal_kedatangan).format('YYYY-MM-DDTHH:mm'),
        harga: String(item.harga), id_kereta: String(item.id_kereta),
      });
    } else {
      setEditItem(null);
      setForm({ asal_keberangkatan: '', tujuan_keberangkatan: '', tanggal_berangkat: '', tanggal_kedatangan: '', harga: '', id_kereta: '' });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.asal_keberangkatan || !form.tujuan_keberangkatan || !form.tanggal_berangkat || !form.harga || !form.id_kereta) {
      setSnack({ open: true, msg: 'Semua field wajib diisi', sev: 'error' }); return;
    }
    setSaving(true);
    try {
      const body = {
        asal_keberangkatan: form.asal_keberangkatan, tujuan_keberangkatan: form.tujuan_keberangkatan,
        tanggal_berangkat: new Date(form.tanggal_berangkat).toISOString(),
        tanggal_kedatangan: form.tanggal_kedatangan ? new Date(form.tanggal_kedatangan).toISOString() : undefined,
        harga: Number(form.harga), id_kereta: Number(form.id_kereta),
      };
      if (editItem) { await apiFetch(`/jadwal/${editItem.id}`, { method: 'PATCH', body: JSON.stringify(body) }); setSnack({ open: true, msg: 'Jadwal berhasil diupdate', sev: 'success' }); }
      else { await apiFetch('/jadwal', { method: 'POST', body: JSON.stringify(body) }); setSnack({ open: true, msg: 'Jadwal berhasil ditambahkan', sev: 'success' }); }
      setOpen(false); load();
    } catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await apiFetch(`/jadwal/${deleteId}`, { method: 'DELETE' }); setSnack({ open: true, msg: 'Jadwal berhasil dihapus', sev: 'success' }); load(); }
    catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); }
    setDeleteId(null);
  };

  const filtered = data.filter(d => d.asal_keberangkatan?.toLowerCase().includes(search.toLowerCase()) || d.tujuan_keberangkatan?.toLowerCase().includes(search.toLowerCase()));
  const getKeretaName = (id: number) => keretaList.find(k => k.id === id)?.nama_kereta || `#${id}`;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Jadwal Keberangkatan</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{data.length} jadwal terdaftar</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" placeholder="Cari kota..." value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }} sx={{ ...tf, minWidth: 200 }} />
          <Button startIcon={<Add />} onClick={() => handleOpen()} sx={{ ...gb, px: 2.5 }}>Tambah</Button>
        </Box>
      </Box>
      <Card sx={cs}>
        <TableContainer><Table>
          <TableHead><TableRow>
            <TableCell sx={hc}>ID</TableCell><TableCell sx={hc}>Rute</TableCell><TableCell sx={hc}>Berangkat</TableCell><TableCell sx={hc}>Tiba</TableCell><TableCell sx={hc}>Harga</TableCell><TableCell sx={hc}>Kereta</TableCell><TableCell sx={hc} align="right">Aksi</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={7} align="center" sx={{ borderBottom: 'none', py: 6 }}><CircularProgress size={30} sx={{ color: '#f5576c' }} /></TableCell></TableRow>
            : filtered.length === 0 ? <TableRow><TableCell colSpan={7} align="center" sx={{ color: 'rgba(255,255,255,0.3)', borderBottom: 'none', py: 6 }}>Tidak ada data</TableCell></TableRow>
            : filtered.map(item => (
              <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)' }}>{item.id}</TableCell>
                <TableCell sx={bc}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{item.asal_keberangkatan}</Typography>
                    <ArrowForward sx={{ color: '#f5576c', fontSize: 14 }} />
                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{item.tujuan_keberangkatan}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{dayjs(item.tanggal_berangkat).format('DD MMM YYYY HH:mm')}</TableCell>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{dayjs(item.tanggal_kedatangan).format('DD MMM YYYY HH:mm')}</TableCell>
                <TableCell sx={bc}><Chip label={`Rp ${Number(item.harga).toLocaleString('id-ID')}`} size="small" sx={{ background: 'rgba(67,233,123,0.15)', color: '#43e97b', fontWeight: 600, fontSize: 11 }} /></TableCell>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{getKeretaName(item.id_kereta)}</TableCell>
                <TableCell align="right" sx={bc}>
                  <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(item)} sx={{ color: '#4facfe' }}><Edit fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Hapus"><IconButton size="small" onClick={() => setDeleteId(item.id)} sx={{ color: '#f5576c' }}><Delete fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></TableContainer>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: dp }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>{editItem ? 'Edit Jadwal' : 'Tambah Jadwal'}<IconButton onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.4)' }}><Close /></IconButton></DialogTitle>
        <DialogContent sx={{ pt: '16px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Kota Asal" value={form.asal_keberangkatan} onChange={e => setForm({ ...form, asal_keberangkatan: e.target.value })} fullWidth sx={tf} /></Grid>
            <Grid item xs={6}><TextField label="Kota Tujuan" value={form.tujuan_keberangkatan} onChange={e => setForm({ ...form, tujuan_keberangkatan: e.target.value })} fullWidth sx={tf} /></Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Tanggal Berangkat" type="datetime-local" value={form.tanggal_berangkat} onChange={e => setForm({ ...form, tanggal_berangkat: e.target.value })} fullWidth sx={tf} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField label="Tanggal Tiba" type="datetime-local" value={form.tanggal_kedatangan} onChange={e => setForm({ ...form, tanggal_kedatangan: e.target.value })} fullWidth sx={tf} InputLabelProps={{ shrink: true }} /></Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Harga (Rp)" type="number" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} fullWidth sx={tf} /></Grid>
            <Grid item xs={6}><TextField label="Kereta" value={form.id_kereta} onChange={e => setForm({ ...form, id_kereta: e.target.value })} fullWidth select sx={tf}>
              {keretaList.map(k => <MenuItem key={k.id} value={String(k.id)}>{k.nama_kereta}</MenuItem>)}
            </TextField></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleSave} disabled={saving} sx={{ ...gb, px: 3 }}>{saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : editItem ? 'Update' : 'Simpan'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: dp }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Konfirmasi Hapus</DialogTitle>
        <DialogContent><Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Yakin ingin menghapus jadwal ini?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleDelete} sx={{ background: '#f5576c', color: 'white', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { background: '#e04458' } }}>Hapus</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
