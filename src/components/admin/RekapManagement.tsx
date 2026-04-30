'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, MenuItem, CircularProgress, Grid,
} from '@mui/material';
import { BarChart, TrendingUp, CalendarMonth } from '@mui/icons-material';
import { apiFetch } from '@/lib/api';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const tf = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#f5576c' }, background: 'rgba(255,255,255,0.05)' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#f5576c' } },
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const colors = ['#f5576c', '#4facfe', '#43e97b', '#f093fb', '#ffd93d', '#6c5ce7', '#fd79a8', '#00cec9', '#e17055', '#0984e3', '#00b894', '#e84393'];

interface RekapItem { bulan: number; total_pemasukan: number; }

export default function RekapManagement() {
  const [data, setData] = useState<RekapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));

  const load = async () => {
    setLoading(true);
    try {
      const r = await apiFetch(`/pembelian-tiket/rekap/${tahun}`);
      const items = Array.isArray(r) ? r : (r?.data && Array.isArray(r.data) ? r.data : []);
      setData(items);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [tahun]);

  const chartData = monthNames.map((name, i) => {
    const found = data.find(d => d.bulan === i + 1);
    return { name, value: found ? Number(found.total_pemasukan) : 0 };
  });

  const totalPemasukan = chartData.reduce((sum, d) => sum + d.value, 0);
  const maxBulan = chartData.reduce((max, d) => d.value > max.value ? d : max, chartData[0]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <Box sx={{ background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 1.5 }}>
        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{label}</Typography>
        <Typography sx={{ color: '#43e97b', fontSize: 12 }}>Rp {Number(payload[0].value).toLocaleString('id-ID')}</Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Rekap Pemasukan</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Pemasukan per bulan tahun {tahun}</Typography>
        </Box>
        <TextField size="small" label="Tahun" value={tahun} onChange={e => setTahun(e.target.value)} sx={{ ...tf, minWidth: 100 }} />
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 50, height: 50, borderRadius: 2, background: 'rgba(67,233,123,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp sx={{ color: '#43e97b' }} />
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Total Pemasukan {tahun}</Typography>
                  <Typography sx={{ color: '#43e97b', fontWeight: 800, fontSize: 22 }}>Rp {totalPemasukan.toLocaleString('id-ID')}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 50, height: 50, borderRadius: 2, background: 'rgba(245,87,108,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarMonth sx={{ color: '#f5576c' }} />
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Bulan Tertinggi</Typography>
                  <Typography sx={{ color: '#f5576c', fontWeight: 800, fontSize: 22 }}>{maxBulan?.name || '-'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 50, height: 50, borderRadius: 2, background: 'rgba(79,172,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart sx={{ color: '#4facfe' }} />
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Rata-rata Bulanan</Typography>
                  <Typography sx={{ color: '#4facfe', fontWeight: 800, fontSize: 22 }}>Rp {Math.round(totalPemasukan / 12).toLocaleString('id-ID')}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
            Grafik Pemasukan Bulanan
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={30} sx={{ color: '#f5576c' }} /></Box>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBar data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickFormatter={v => `${(v / 1000000).toFixed(1)}jt`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Bar>
              </RechartsBar>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
