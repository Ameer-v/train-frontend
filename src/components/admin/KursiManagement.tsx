'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert, Chip, Tooltip, InputAdornment,
  CircularProgress, MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Search, AirlineSeatReclineNormal, Close } from '@mui/icons-material';
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

export default function KursiManagement() {
  const [data, setData] = useState<any[]>([]);
  const [gerbongList, setGerbongList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ no_kursi: '', id_gerbong: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' as 'success' | 'error' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [k, g] = await Promise.all([apiFetch('/kursi'), apiFetch('/gerbong')]);
      setData(Array.isArray(k) ? k : []);
      setGerbongList(Array.isArray(g) ? g : []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleOpen = (item?: any) => {
    if (item) { setEditItem(item); setForm({ no_kursi: item.no_kursi, id_gerbong: String(item.id_gerbong) }); }
    else { setEditItem(null); setForm({ no_kursi: '', id_gerbong: '' }); }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.no_kursi || !form.id_gerbong) { setSnack({ open: true, msg: 'Semua field wajib diisi', sev: 'error' }); return; }
    setSaving(true);
    try {
      const body = { no_kursi: form.no_kursi, id_gerbong: Number(form.id_gerbong) };
      if (editItem) { await apiFetch(`/kursi/${editItem.id}`, { method: 'PATCH', body: JSON.stringify(body) }); setSnack({ open: true, msg: 'Kursi berhasil diupdate', sev: 'success' }); }
      else { await apiFetch('/kursi', { method: 'POST', body: JSON.stringify(body) }); setSnack({ open: true, msg: 'Kursi berhasil ditambahkan', sev: 'success' }); }
      setOpen(false); load();
    } catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await apiFetch(`/kursi/${deleteId}`, { method: 'DELETE' }); setSnack({ open: true, msg: 'Kursi berhasil dihapus', sev: 'success' }); load(); }
    catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); }
    setDeleteId(null);
  };

  const filtered = data.filter(d => d.no_kursi?.toLowerCase().includes(search.toLowerCase()));
  const getGerbongName = (id: number) => gerbongList.find(g => g.id === id)?.nama_gerbong || `Gerbong #${id}`;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Data Kursi</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{data.length} kursi terdaftar</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" placeholder="Cari kursi..." value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }} sx={{ ...tf, minWidth: 200 }} />
          <Button startIcon={<Add />} onClick={() => handleOpen()} sx={{ ...gb, px: 2.5 }}>Tambah</Button>
        </Box>
      </Box>
      <Card sx={cs}>
        <TableContainer><Table>
          <TableHead><TableRow>
            <TableCell sx={hc}>ID</TableCell><TableCell sx={hc}>No Kursi</TableCell><TableCell sx={hc}>Gerbong</TableCell><TableCell sx={hc} align="right">Aksi</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} align="center" sx={{ borderBottom: 'none', py: 6 }}><CircularProgress size={30} sx={{ color: '#f5576c' }} /></TableCell></TableRow>
            : filtered.length === 0 ? <TableRow><TableCell colSpan={4} align="center" sx={{ color: 'rgba(255,255,255,0.3)', borderBottom: 'none', py: 6 }}>Tidak ada data</TableCell></TableRow>
            : filtered.map(item => (
              <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)' }}>{item.id}</TableCell>
                <TableCell sx={bc}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(67,233,123,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AirlineSeatReclineNormal sx={{ color: '#43e97b', fontSize: 18 }} /></Box>
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.no_kursi}</Typography>
                </Box></TableCell>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{getGerbongName(item.id_gerbong)}</TableCell>
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>{editItem ? 'Edit Kursi' : 'Tambah Kursi'}<IconButton onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.4)' }}><Close /></IconButton></DialogTitle>
        <DialogContent sx={{ pt: '16px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="No Kursi" value={form.no_kursi} onChange={e => setForm({ ...form, no_kursi: e.target.value })} fullWidth sx={tf} />
          <TextField label="Gerbong" value={form.id_gerbong} onChange={e => setForm({ ...form, id_gerbong: e.target.value })} fullWidth select sx={tf}>
            {gerbongList.map(g => <MenuItem key={g.id} value={String(g.id)}>{g.nama_gerbong}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleSave} disabled={saving} sx={{ ...gb, px: 3 }}>{saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : editItem ? 'Update' : 'Simpan'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: dp }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Konfirmasi Hapus</DialogTitle>
        <DialogContent><Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Yakin ingin menghapus kursi ini?</Typography></DialogContent>
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
