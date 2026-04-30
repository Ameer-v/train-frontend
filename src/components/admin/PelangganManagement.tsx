'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert, Tooltip, InputAdornment,
  CircularProgress, Grid,
} from '@mui/material';
import { Add, Edit, Delete, Search, People, Close } from '@mui/icons-material';
import { apiFetch } from '@/lib/api';

const cs = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 };
const tf = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#f5576c' }, background: 'rgba(255,255,255,0.05)' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#f5576c' } },
};
const hc = { color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600 };
const bc = { borderBottom: '1px solid rgba(255,255,255,0.04)' };
const dp = { background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 };
const gb = { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #e07de8 0%, #e04458 100%)' } };

export default function PelangganManagement() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ username: '', password: '', NIK: '', nama_penumpang: '', alamat: '', telp: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' as 'success' | 'error' });
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); try { const r = await apiFetch('/pelanggan'); setData(Array.isArray(r) ? r : []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleOpen = (item?: any) => {
    if (item) { setEditItem(item); setForm({ username: '', password: '', NIK: item.NIK || '', nama_penumpang: item.nama_penumpang || '', alamat: item.alamat || '', telp: item.telp || '' }); }
    else { setEditItem(null); setForm({ username: '', password: '', NIK: '', nama_penumpang: '', alamat: '', telp: '' }); }
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        const body: any = { NIK: form.NIK, nama_penumpang: form.nama_penumpang, alamat: form.alamat, telp: form.telp };
        await apiFetch(`/pelanggan/${editItem.id}`, { method: 'PATCH', body: JSON.stringify(body) });
        setSnack({ open: true, msg: 'Pelanggan berhasil diupdate', sev: 'success' });
      } else {
        if (!form.username || !form.password || !form.NIK || !form.nama_penumpang) { setSnack({ open: true, msg: 'Semua field wajib diisi', sev: 'error' }); setSaving(false); return; }
        await apiFetch('/pelanggan', { method: 'POST', body: JSON.stringify(form) });
        setSnack({ open: true, msg: 'Pelanggan berhasil ditambahkan', sev: 'success' });
      }
      setOpen(false); load();
    } catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await apiFetch(`/pelanggan/${deleteId}`, { method: 'DELETE' }); setSnack({ open: true, msg: 'Pelanggan berhasil dihapus', sev: 'success' }); load(); }
    catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); }
    setDeleteId(null);
  };

  const filtered = data.filter(d => d.nama_penumpang?.toLowerCase().includes(search.toLowerCase()) || d.NIK?.includes(search));

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Data Pelanggan</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{data.length} pelanggan terdaftar</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" placeholder="Cari pelanggan..." value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }} sx={{ ...tf, minWidth: 200 }} />
          <Button startIcon={<Add />} onClick={() => handleOpen()} sx={{ ...gb, px: 2.5 }}>Tambah</Button>
        </Box>
      </Box>
      <Card sx={cs}>
        <TableContainer><Table>
          <TableHead><TableRow>
            <TableCell sx={hc}>ID</TableCell><TableCell sx={hc}>Nama</TableCell><TableCell sx={hc}>NIK</TableCell><TableCell sx={hc}>Alamat</TableCell><TableCell sx={hc}>Telepon</TableCell><TableCell sx={hc} align="right">Aksi</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6} align="center" sx={{ borderBottom: 'none', py: 6 }}><CircularProgress size={30} sx={{ color: '#f5576c' }} /></TableCell></TableRow>
            : filtered.length === 0 ? <TableRow><TableCell colSpan={6} align="center" sx={{ color: 'rgba(255,255,255,0.3)', borderBottom: 'none', py: 6 }}>Tidak ada data</TableCell></TableRow>
            : filtered.map(item => (
              <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)' }}>{item.id}</TableCell>
                <TableCell sx={bc}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(79,172,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><People sx={{ color: '#4facfe', fontSize: 18 }} /></Box>
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.nama_penumpang}</Typography>
                </Box></TableCell>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.NIK}</TableCell>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 13, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.alamat}</TableCell>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.telp}</TableCell>
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>{editItem ? 'Edit Pelanggan' : 'Tambah Pelanggan'}<IconButton onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.4)' }}><Close /></IconButton></DialogTitle>
        <DialogContent sx={{ pt: '16px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {!editItem && <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} fullWidth sx={tf} /></Grid>
            <Grid item xs={6}><TextField label="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} fullWidth type="password" sx={tf} /></Grid>
          </Grid>}
          <TextField label="NIK" value={form.NIK} onChange={e => setForm({ ...form, NIK: e.target.value })} fullWidth sx={tf} />
          <TextField label="Nama Penumpang" value={form.nama_penumpang} onChange={e => setForm({ ...form, nama_penumpang: e.target.value })} fullWidth sx={tf} />
          <Grid container spacing={2}>
            <Grid item xs={7}><TextField label="Alamat" value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })} fullWidth sx={tf} /></Grid>
            <Grid item xs={5}><TextField label="Telepon" value={form.telp} onChange={e => setForm({ ...form, telp: e.target.value })} fullWidth sx={tf} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleSave} disabled={saving} sx={{ ...gb, px: 3 }}>{saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : editItem ? 'Update' : 'Simpan'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: dp }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Konfirmasi Hapus</DialogTitle>
        <DialogContent><Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Yakin ingin menghapus pelanggan ini?</Typography></DialogContent>
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
