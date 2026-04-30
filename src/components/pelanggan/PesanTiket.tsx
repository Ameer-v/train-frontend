'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button, CircularProgress,
  Chip, Grid, Stepper, Step, StepLabel, Snackbar, Alert, IconButton, Divider,
} from '@mui/material';
import {
  Train, ArrowForward, EventNote, AirlineSeatReclineNormal,
  PersonAdd, CheckCircle, Add, Remove, ArrowBack,
} from '@mui/icons-material';
import { apiFetch } from '@/lib/api';
import dayjs from 'dayjs';

const tf = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#4facfe' }, background: 'rgba(255,255,255,0.05)' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#4facfe' } },
};
const cs = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 };

interface Passenger { NIK: string; nama_penumpang: string; id_kursi: number | null; }

interface Props { initialJadwal?: any; onBack?: () => void; }

export default function PesanTiket({ initialJadwal, onBack }: Props) {
  const [step, setStep] = useState(initialJadwal ? 1 : 0);
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [selectedJadwal, setSelectedJadwal] = useState<any>(initialJadwal || null);
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([{ NIK: '', nama_penumpang: '', id_kursi: null }]);
  const [loading, setLoading] = useState(false);
  const [seatLoading, setSeatLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' as 'success' | 'error' });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!initialJadwal) {
      apiFetch('/jadwal').then(r => setJadwalList(Array.isArray(r) ? r : [])).catch(() => {});
    }
    if (initialJadwal) loadSeats(initialJadwal.id);
  }, []);

  const loadSeats = async (jadwalId: number) => {
    setSeatLoading(true);
    try {
      const r = await apiFetch(`/kursi/tersedia?id_jadwal=${jadwalId}`);
      setAvailableSeats(Array.isArray(r) ? r : []);
    } catch {} finally { setSeatLoading(false); }
  };

  const selectJadwal = (j: any) => {
    setSelectedJadwal(j);
    loadSeats(j.id);
    setStep(1);
  };

  const toggleSeat = (seat: any) => {
    const currentAssigned = passengers.filter(p => p.id_kursi !== null).map(p => p.id_kursi);
    const firstEmpty = passengers.findIndex(p => p.id_kursi === null);
    if (currentAssigned.includes(seat.id)) {
      setPassengers(passengers.map(p => p.id_kursi === seat.id ? { ...p, id_kursi: null } : p));
    } else if (firstEmpty !== -1) {
      const updated = [...passengers];
      updated[firstEmpty] = { ...updated[firstEmpty], id_kursi: seat.id };
      setPassengers(updated);
    }
  };

  const addPassenger = () => setPassengers([...passengers, { NIK: '', nama_penumpang: '', id_kursi: null }]);
  const removePassenger = (i: number) => { if (passengers.length > 1) setPassengers(passengers.filter((_, idx) => idx !== i)); };
  const updatePassenger = (i: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[i] = { ...updated[i], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = async () => {
    if (passengers.some(p => !p.NIK || !p.nama_penumpang || !p.id_kursi)) {
      setSnack({ open: true, msg: 'Lengkapi semua data penumpang dan pilih kursi', sev: 'error' }); return;
    }
    setLoading(true);
    try {
      await apiFetch('/pembelian-tiket', {
        method: 'POST',
        body: JSON.stringify({
          id_jadwal: selectedJadwal.id,
          detail_penumpang: passengers.map(p => ({ NIK: p.NIK, nama_penumpang: p.nama_penumpang, id_kursi: p.id_kursi })),
        }),
      });
      setSuccess(true);
      setSnack({ open: true, msg: 'Tiket berhasil dipesan!', sev: 'success' });
    } catch (e: any) { setSnack({ open: true, msg: e.message, sev: 'error' }); }
    finally { setLoading(false); }
  };

  const steps = ['Pilih Jadwal', 'Pilih Kursi', 'Data Penumpang', 'Konfirmasi'];
  const selectedSeatIds = passengers.map(p => p.id_kursi).filter(Boolean);

  if (success) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <CheckCircle sx={{ color: '#43e97b', fontSize: 80, mb: 2 }} />
        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 24, mb: 1 }}>Pemesanan Berhasil!</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, mb: 3 }}>Tiket Anda telah berhasil dipesan</Typography>
        <Button onClick={() => { setSuccess(false); setStep(0); setPassengers([{ NIK: '', nama_penumpang: '', id_kursi: null }]); setSelectedJadwal(null); }}
          sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 4 }}>
          Pesan Tiket Lagi
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {step > 0 && <IconButton onClick={() => setStep(step - 1)} sx={{ color: 'rgba(255,255,255,0.5)' }}><ArrowBack /></IconButton>}
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Pesan Tiket</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{steps[step]}</Typography>
        </Box>
      </Box>

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4, '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.4)', fontSize: 12 }, '& .MuiStepLabel-label.Mui-active': { color: '#4facfe' }, '& .MuiStepLabel-label.Mui-completed': { color: '#43e97b' }, '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.1)' }, '& .MuiStepIcon-root.Mui-active': { color: '#4facfe' }, '& .MuiStepIcon-root.Mui-completed': { color: '#43e97b' } }}>
        {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {/* Step 0: Select schedule */}
      {step === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {jadwalList.map(j => (
            <Card key={j.id} onClick={() => selectJadwal(j)} sx={{ ...cs, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'rgba(79,172,254,0.3)', transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: '#4facfe' }}><Train /></Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{j.asal_keberangkatan} → {j.tujuan_keberangkatan}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{dayjs(j.tanggal_berangkat).format('DD MMM YYYY HH:mm')}</Typography>
                </Box>
                <Typography sx={{ color: '#43e97b', fontWeight: 700 }}>Rp {Number(j.harga).toLocaleString('id-ID')}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Step 1: Select seats */}
      {step === 1 && (
        <Box>
          {selectedJadwal && (
            <Card sx={{ ...cs, mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Train sx={{ color: '#4facfe', fontSize: 20 }} />
                  <Typography sx={{ color: 'white', fontWeight: 700 }}>{selectedJadwal.asal_keberangkatan} → {selectedJadwal.tujuan_keberangkatan}</Typography>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{dayjs(selectedJadwal.tanggal_berangkat).format('DD MMM YYYY HH:mm')} | Rp {Number(selectedJadwal.harga).toLocaleString('id-ID')}/orang</Typography>
              </CardContent>
            </Card>
          )}
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mb: 2 }}>Pilih {passengers.length} kursi ({selectedSeatIds.length}/{passengers.length} dipilih)</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip icon={<Box sx={{ width: 12, height: 12, borderRadius: 1, background: '#43e97b' }} />} label="Tersedia" size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
            <Chip icon={<Box sx={{ width: 12, height: 12, borderRadius: 1, background: '#4facfe' }} />} label="Dipilih" size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
          </Box>
          {seatLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={30} sx={{ color: '#4facfe' }} /></Box> : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableSeats.map(seat => {
                const isSelected = selectedSeatIds.includes(seat.id);
                return (
                  <Box key={seat.id} onClick={() => toggleSeat(seat)} sx={{
                    width: 52, height: 52, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    background: isSelected ? 'rgba(79,172,254,0.2)' : 'rgba(67,233,123,0.1)',
                    border: `2px solid ${isSelected ? '#4facfe' : 'rgba(67,233,123,0.3)'}`,
                    transition: 'all 0.2s', '&:hover': { transform: 'scale(1.1)', borderColor: '#4facfe' },
                  }}>
                    <Typography sx={{ color: isSelected ? '#4facfe' : '#43e97b', fontWeight: 700, fontSize: 13 }}>{seat.no_kursi}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
          {availableSeats.length === 0 && !seatLoading && <Typography sx={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', py: 4 }}>Tidak ada kursi tersedia</Typography>}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={addPassenger} startIcon={<Add />} size="small" sx={{ color: '#4facfe', textTransform: 'none', fontSize: 12 }}>Tambah Penumpang</Button>
              {passengers.length > 1 && <Button onClick={() => removePassenger(passengers.length - 1)} startIcon={<Remove />} size="small" sx={{ color: '#f5576c', textTransform: 'none', fontSize: 12 }}>Kurangi</Button>}
            </Box>
            <Button onClick={() => setStep(2)} disabled={selectedSeatIds.length !== passengers.length}
              sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { background: 'linear-gradient(135deg, #3d9ae6 0%, #00d4e0 100%)' }, '&:disabled': { opacity: 0.5, color: 'white' } }}>
              Lanjut
            </Button>
          </Box>
        </Box>
      )}

      {/* Step 2: Passenger data */}
      {step === 2 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {passengers.map((p, i) => (
              <Card key={i} sx={cs}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ color: '#4facfe', fontWeight: 600, fontSize: 14 }}>Penumpang {i + 1}</Typography>
                    <Chip label={`Kursi ${availableSeats.find(s => s.id === p.id_kursi)?.no_kursi || '-'}`} size="small" sx={{ background: 'rgba(79,172,254,0.15)', color: '#4facfe', fontWeight: 600, fontSize: 11 }} />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}><TextField label="NIK" value={p.NIK} onChange={e => updatePassenger(i, 'NIK', e.target.value)} fullWidth size="small" sx={tf} /></Grid>
                    <Grid item xs={12} sm={7}><TextField label="Nama Penumpang" value={p.nama_penumpang} onChange={e => updatePassenger(i, 'nama_penumpang', e.target.value)} fullWidth size="small" sx={tf} /></Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={() => setStep(3)} disabled={passengers.some(p => !p.NIK || !p.nama_penumpang)}
              sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { background: 'linear-gradient(135deg, #3d9ae6 0%, #00d4e0 100%)' }, '&:disabled': { opacity: 0.5, color: 'white' } }}>
              Lanjut
            </Button>
          </Box>
        </Box>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedJadwal && (
        <Box>
          <Card sx={cs}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>Ringkasan Pemesanan</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Train sx={{ color: '#4facfe' }} />
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{selectedJadwal.asal_keberangkatan}</Typography>
                <ArrowForward sx={{ color: '#f5576c' }} />
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{selectedJadwal.tujuan_keberangkatan}</Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mb: 3 }}>{dayjs(selectedJadwal.tanggal_berangkat).format('DD MMMM YYYY, HH:mm')} WIB</Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>Data Penumpang</Typography>
              {passengers.map((p, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Box>
                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{p.nama_penumpang}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>NIK: {p.NIK}</Typography>
                  </Box>
                  <Chip label={`Kursi ${availableSeats.find(s => s.id === p.id_kursi)?.no_kursi || '-'}`} size="small" sx={{ background: 'rgba(79,172,254,0.15)', color: '#4facfe', fontWeight: 600, fontSize: 11 }} />
                </Box>
              ))}
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Total ({passengers.length} penumpang)</Typography>
                <Typography sx={{ color: '#43e97b', fontWeight: 800, fontSize: 24 }}>Rp {(Number(selectedJadwal.harga) * passengers.length).toLocaleString('id-ID')}</Typography>
              </Box>
            </CardContent>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleSubmit} disabled={loading}
              sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#0a2e1a', borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 4, py: 1.5, fontSize: 15, '&:hover': { background: 'linear-gradient(135deg, #3ad76e 0%, #30e0c0 100%)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(67,233,123,0.3)' }, transition: 'all 0.2s' }}>
              {loading ? <CircularProgress size={22} sx={{ color: '#0a2e1a' }} /> : 'Konfirmasi & Bayar'}
            </Button>
          </Box>
        </Box>
      )}

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
