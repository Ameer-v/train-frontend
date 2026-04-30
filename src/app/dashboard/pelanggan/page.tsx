'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, AppBar, Toolbar, Typography, Card, CardContent,
  Grid, Button, Avatar, Chip, Divider, IconButton, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip,
} from '@mui/material';
import {
  Train as TrainIcon,
  ConfirmationNumber,
  History,
  EventNote,
  Logout,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Search,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
  { label: 'Cari Jadwal', icon: <Search />, path: 'jadwal' },
  { label: 'Pesan Tiket', icon: <ConfirmationNumber />, path: 'pesan' },
  { label: 'Histori Pemesanan', icon: <History />, path: 'histori' },
];

export default function PelangganDashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [histori, setHistori] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'penumpang') {
      router.push('/login');
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const base = process.env.NEXT_PUBLIC_API_URL;
      const [jadwalRes, historiRes] = await Promise.all([
        fetch(`${base}/jadwal`, { headers }).then(r => r.json()),
        fetch(`${base}/pembelian-tiket/histori`, { headers }).then(r => r.json()),
      ]);
      setJadwal(Array.isArray(jadwalRes) ? jadwalRes.slice(0, 5) : []);
      setHistori(Array.isArray(historiRes) ? historiRes.slice(0, 5) : []);
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0f1923' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TrainIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 16, fontFamily: '"Playfair Display", serif' }}>
            KA Citra
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
            Portal Pelanggan
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => setActiveMenu(item.path)}
              sx={{
                borderRadius: 2, py: 1.2, px: 2,
                background: activeMenu === item.path
                  ? 'linear-gradient(135deg, rgba(79,172,254,0.15) 0%, rgba(0,242,254,0.15) 100%)'
                  : 'transparent',
                borderLeft: activeMenu === item.path ? '3px solid #4facfe' : '3px solid transparent',
                '&:hover': { background: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: activeMenu === item.path ? '#4facfe' : 'rgba(255,255,255,0.4)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: activeMenu === item.path ? 600 : 400,
                  color: activeMenu === item.path ? 'white' : 'rgba(255,255,255,0.5)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', fontSize: 14 }}>
          P
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Pelanggan</Typography>
          <Chip label="Penumpang" size="small" sx={{ height: 16, fontSize: 9, background: 'rgba(79,172,254,0.2)', color: '#4facfe', mt: 0.2 }} />
        </Box>
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} size="small" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#4facfe' } }}>
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#111b27' }}>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
        {drawerContent}
      </Drawer>
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
        {drawerContent}
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ background: 'rgba(17,27,39,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Toolbar>
            <IconButton sx={{ display: { md: 'none' }, color: 'white', mr: 1 }} onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18, flex: 1 }}>
              {menuItems.find(m => m.path === activeMenu)?.label || 'Dashboard'}
            </Typography>
            <Button
              onClick={() => setActiveMenu('pesan')}
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white', borderRadius: 2, textTransform: 'none',
                fontWeight: 600, fontSize: 13, px: 2,
              }}
              startIcon={<ConfirmationNumber />}
            >
              Pesan Tiket
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: 3 }}>
          {activeMenu === 'dashboard' && (
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, fontSize: 14 }}>
                Selamat datang! Mau pergi ke mana hari ini? 🚂
              </Typography>

              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {[
                  { label: 'Tiket Dipesan', value: histori.length, icon: <ConfirmationNumber />, color: '#4facfe', bg: 'rgba(79,172,254,0.1)' },
                  { label: 'Jadwal Tersedia', value: jadwal.length, icon: <EventNote />, color: '#43e97b', bg: 'rgba(67,233,123,0.1)' },
                ].map(stat => (
                  <Grid item xs={12} sm={6} key={stat.label}>
                    <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 }}>
                      <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 50, height: 50, borderRadius: 2, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{stat.label}</Typography>
                          <Typography sx={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{stat.value}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Jadwal Terbaru */}
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Jadwal Tersedia
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {jadwal.length === 0 && (
                  <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Belum ada jadwal tersedia</Typography>
                )}
                {jadwal.map((j: any) => (
                  <Card key={j.id} sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 }}>
                    <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: '#4facfe' }}><TrainIcon /></Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>
                          {j.asal_keberangkatan} → {j.tujuan_keberangkatan}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                          {new Date(j.tanggal_berangkat).toLocaleString('id-ID')}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: '#4facfe', fontWeight: 700, fontSize: 15 }}>
                          Rp {j.harga?.toLocaleString('id-ID')}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => setActiveMenu('pesan')}
                          sx={{ mt: 0.5, textTransform: 'none', color: '#4facfe', fontSize: 11, p: 0 }}
                        >
                          Pesan →
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {activeMenu !== 'dashboard' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, flexDirection: 'column', gap: 2 }}>
              <Box sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 64 }}>
                {menuItems.find(m => m.path === activeMenu)?.icon}
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
                Halaman {menuItems.find(m => m.path === activeMenu)?.label} akan segera tersedia
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
