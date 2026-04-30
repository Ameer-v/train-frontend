'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert, Chip, Tooltip, InputAdornment,
  CircularProgress, MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Search, Train as TrainIcon, Close } from '@mui/icons-material';
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

interface Kereta { id: number; nama_kereta: string; deskripsi: string; kelas: string; }

export default function KeretaManagement() {
  const [data, setData] = useState<Kereta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Kereta | null>(null);
  const [form, setForm] = useState({ nama_kereta: '', deskripsi: '', kelas: 'Eksekutif' });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' as 'success' | 'error' });
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); try { const r = await apiFetch('/kereta'); setData(Array.isArray(r) ? r : []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleOpen = (item?: Kereta) => {
    if (item) { setEditItem(item); setForm({ nama_kereta: item.nama_kereta, deskripsi: item.deskripsi, kelas: item.kelas }); }
    else { setEditItem(null); setForm({ nama_kereta: '', deskripsi: '', kelas: 'Eksekutif' }); }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama_kereta || !form.kelas) { setSnack({ open: true, msg: 'Nama kereta dan kelas wajib diisi', sev: 'error' }); return; }
    setSaving(true);
    try {
      if (editItem) { await apiFetch(`/kereta/${editItem.id}`, { method: 'PATCH', body: JSON.stringify(form) }); setSnack({ open: true, msg: 'Kereta berhasil diupdate', sev: 'success' }); }
      else { await apiFetch('/kereta', { method: 'POST', body: JSON.stringify(form) }); setSnack({ open: true, msg: 'Kereta berhasil ditambahkan', sev: 'success' }); }
      setOpen(false); load();
    } catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await apiFetch(`/kereta/${deleteId}`, { method: 'DELETE' }); setSnack({ open: true, msg: 'Kereta berhasil dihapus', sev: 'success' }); load(); }
    catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); }
    setDeleteId(null);
  };

  const filtered = data.filter(d => d.nama_kereta.toLowerCase().includes(search.toLowerCase()) || d.kelas.toLowerCase().includes(search.toLowerCase()));
  const kc: Record<string, string> = { 'Eksekutif': '#f5576c', 'Bisnis': '#4facfe', 'Ekonomi': '#43e97b' };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Data Kereta</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{data.length} kereta terdaftar</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" placeholder="Cari kereta..." value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }} sx={{ ...tf, minWidth: 200 }} />
          <Button startIcon={<Add />} onClick={() => handleOpen()} sx={{ ...gb, px: 2.5 }}>Tambah</Button>
        </Box>
      </Box>
      <Card sx={cs}>
        <TableContainer>
          <Table>
            <TableHead><TableRow>
              <TableCell sx={hc}>ID</TableCell><TableCell sx={hc}>Nama Kereta</TableCell><TableCell sx={hc}>Deskripsi</TableCell><TableCell sx={hc}>Kelas</TableCell><TableCell sx={hc} align="right">Aksi</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={5} align="center" sx={{ borderBottom: 'none', py: 6 }}><CircularProgress size={30} sx={{ color: '#f5576c' }} /></TableCell></TableRow>
              : filtered.length === 0 ? <TableRow><TableCell colSpan={5} align="center" sx={{ color: 'rgba(255,255,255,0.3)', borderBottom: 'none', py: 6 }}>Tidak ada data</TableCell></TableRow>
              : filtered.map(item => (
                <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)' }}>{item.id}</TableCell>
                  <TableCell sx={bc}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(245,87,108,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrainIcon sx={{ color: '#f5576c', fontSize: 18 }} /></Box>
                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.nama_kereta}</Typography>
                  </Box></TableCell>
                  <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.deskripsi}</TableCell>
                  <TableCell sx={bc}><Chip label={item.kelas} size="small" sx={{ background: `${kc[item.kelas] || '#4facfe'}22`, color: kc[item.kelas] || '#4facfe', fontWeight: 600, fontSize: 11 }} /></TableCell>
                  <TableCell align="right" sx={bc}>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(item)} sx={{ color: '#4facfe' }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Hapus"><IconButton size="small" onClick={() => setDeleteId(item.id)} sx={{ color: '#f5576c' }}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: dp }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>{editItem ? 'Edit Kereta' : 'Tambah Kereta'}<IconButton onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.4)' }}><Close /></IconButton></DialogTitle>
        <DialogContent sx={{ pt: '16px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Nama Kereta" value={form.nama_kereta} onChange={e => setForm({ ...form, nama_kereta: e.target.value })} fullWidth sx={tf} />
          <TextField label="Deskripsi" value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} fullWidth multiline rows={3} sx={tf} />
          <TextField label="Kelas" value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })} fullWidth select sx={tf}>
            {['Eksekutif', 'Bisnis', 'Ekonomi'].map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleSave} disabled={saving} sx={{ ...gb, px: 3 }}>{saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : editItem ? 'Update' : 'Simpan'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: dp }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Konfirmasi Hapus</DialogTitle>
        <DialogContent><Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Yakin ingin menghapus kereta ini?</Typography></DialogContent>
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
