'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert, Chip, Tooltip, InputAdornment,
  CircularProgress, MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Search, DirectionsRailway, Close } from '@mui/icons-material';
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

export default function GerbongManagement() {
  const [data, setData] = useState<any[]>([]);
  const [keretaList, setKeretaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ nama_gerbong: '', kuota: '', id_kereta: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' as 'success' | 'error' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [g, k] = await Promise.all([apiFetch('/gerbong'), apiFetch('/kereta')]);
      setData(Array.isArray(g) ? g : []);
      setKeretaList(Array.isArray(k) ? k : []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleOpen = (item?: any) => {
    if (item) { setEditItem(item); setForm({ nama_gerbong: item.nama_gerbong, kuota: String(item.kuota), id_kereta: String(item.id_kereta) }); }
    else { setEditItem(null); setForm({ nama_gerbong: '', kuota: '', id_kereta: '' }); }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama_gerbong || !form.kuota || !form.id_kereta) { setSnack({ open: true, msg: 'Semua field wajib diisi', sev: 'error' }); return; }
    setSaving(true);
    try {
      const body = { nama_gerbong: form.nama_gerbong, kuota: Number(form.kuota), id_kereta: Number(form.id_kereta) };
      if (editItem) { await apiFetch(`/gerbong/${editItem.id}`, { method: 'PATCH', body: JSON.stringify(body) }); setSnack({ open: true, msg: 'Gerbong berhasil diupdate', sev: 'success' }); }
      else { await apiFetch('/gerbong', { method: 'POST', body: JSON.stringify(body) }); setSnack({ open: true, msg: 'Gerbong berhasil ditambahkan', sev: 'success' }); }
      setOpen(false); load();
    } catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await apiFetch(`/gerbong/${deleteId}`, { method: 'DELETE' }); setSnack({ open: true, msg: 'Gerbong berhasil dihapus', sev: 'success' }); load(); }
    catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); }
    setDeleteId(null);
  };

  const filtered = data.filter(d => d.nama_gerbong?.toLowerCase().includes(search.toLowerCase()));
  const getKeretaName = (id: number) => keretaList.find(k => k.id === id)?.nama_kereta || `Kereta #${id}`;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Data Gerbong</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{data.length} gerbong terdaftar</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" placeholder="Cari gerbong..." value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }} sx={{ ...tf, minWidth: 200 }} />
          <Button startIcon={<Add />} onClick={() => handleOpen()} sx={{ ...gb, px: 2.5 }}>Tambah</Button>
        </Box>
      </Box>
      <Card sx={cs}>
        <TableContainer><Table>
          <TableHead><TableRow>
            <TableCell sx={hc}>ID</TableCell><TableCell sx={hc}>Nama Gerbong</TableCell><TableCell sx={hc}>Kuota</TableCell><TableCell sx={hc}>Kereta</TableCell><TableCell sx={hc} align="right">Aksi</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} align="center" sx={{ borderBottom: 'none', py: 6 }}><CircularProgress size={30} sx={{ color: '#f5576c' }} /></TableCell></TableRow>
            : filtered.length === 0 ? <TableRow><TableCell colSpan={5} align="center" sx={{ color: 'rgba(255,255,255,0.3)', borderBottom: 'none', py: 6 }}>Tidak ada data</TableCell></TableRow>
            : filtered.map(item => (
              <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ ...bc, color: 'rgba(255,255,255,0.5)' }}>{item.id}</TableCell>
                <TableCell sx={bc}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(79,172,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DirectionsRailway sx={{ color: '#4facfe', fontSize: 18 }} /></Box>
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.nama_gerbong}</Typography>
                </Box></TableCell>
                <TableCell sx={bc}><Chip label={`${item.kuota} kursi`} size="small" sx={{ background: 'rgba(67,233,123,0.15)', color: '#43e97b', fontWeight: 600, fontSize: 11 }} /></TableCell>
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>{editItem ? 'Edit Gerbong' : 'Tambah Gerbong'}<IconButton onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.4)' }}><Close /></IconButton></DialogTitle>
        <DialogContent sx={{ pt: '16px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Nama Gerbong" value={form.nama_gerbong} onChange={e => setForm({ ...form, nama_gerbong: e.target.value })} fullWidth sx={tf} />
          <TextField label="Kuota Kursi" value={form.kuota} onChange={e => setForm({ ...form, kuota: e.target.value })} fullWidth type="number" sx={tf} />
          <TextField label="Kereta" value={form.id_kereta} onChange={e => setForm({ ...form, id_kereta: e.target.value })} fullWidth select sx={tf}>
            {keretaList.map(k => <MenuItem key={k.id} value={String(k.id)}>{k.nama_kereta}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleSave} disabled={saving} sx={{ ...gb, px: 3 }}>{saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : editItem ? 'Update' : 'Simpan'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: dp }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Konfirmasi Hapus</DialogTitle>
        <DialogContent><Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Yakin ingin menghapus gerbong ini?</Typography></DialogContent>
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
