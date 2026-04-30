'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar,
  Card, CardContent, Grid, Chip, Divider, Menu, MenuItem, Tooltip,
} from '@mui/material';
import {
  Train as TrainIcon,
  Dashboard as DashboardIcon,
  EventNote as JadwalIcon,
  AirlineSeatReclineNormal as KursiIcon,
  People as PelangganIcon,
  ManageAccounts as PetugasIcon,
  ConfirmationNumber as TiketIcon,
  BarChart as RekapIcon,
  Logout,
  Menu as MenuIcon,
  DirectionsRailway as GerbongIcon,
  TrendingUp,
  PersonAdd,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
  { label: 'Data Kereta', icon: <TrainIcon />, path: 'kereta' },
  { label: 'Data Gerbong', icon: <GerbongIcon />, path: 'gerbong' },
  { label: 'Data Kursi', icon: <KursiIcon />, path: 'kursi' },
  { label: 'Jadwal Keberangkatan', icon: <JadwalIcon />, path: 'jadwal' },
  { label: 'Data Pelanggan', icon: <PelangganIcon />, path: 'pelanggan' },
  { label: 'Data Petugas', icon: <PetugasIcon />, path: 'petugas' },
  { label: 'Histori Transaksi', icon: <TiketIcon />, path: 'transaksi' },
  { label: 'Rekap Pemasukan', icon: <RekapIcon />, path: 'rekap' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [stats, setStats] = useState({ kereta: 0, pelanggan: 0, jadwal: 0, transaksi: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchStats(token);
  }, []);

  const fetchStats = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const base = process.env.NEXT_PUBLIC_API_URL;
      const [kereta, pelanggan, jadwal, transaksi] = await Promise.all([
        fetch(`${base}/kereta`, { headers }).then(r => r.json()),
        fetch(`${base}/pelanggan`, { headers }).then(r => r.json()),
        fetch(`${base}/jadwal`, { headers }).then(r => r.json()),
        fetch(`${base}/pembelian-tiket`, { headers }).then(r => r.json()),
      ]);
      setStats({
        kereta: Array.isArray(kereta) ? kereta.length : 0,
        pelanggan: Array.isArray(pelanggan) ? pelanggan.length : 0,
        jadwal: Array.isArray(jadwal) ? jadwal.length : 0,
        transaksi: Array.isArray(transaksi) ? transaksi.length : 0,
      });
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const statCards = [
    { label: 'Total Kereta', value: stats.kereta, icon: <TrainIcon />, color: '#f5576c', bg: 'rgba(245,87,108,0.1)' },
    { label: 'Total Pelanggan', value: stats.pelanggan, icon: <PersonAdd />, color: '#4facfe', bg: 'rgba(79,172,254,0.1)' },
    { label: 'Jadwal Aktif', value: stats.jadwal, icon: <JadwalIcon />, color: '#43e97b', bg: 'rgba(67,233,123,0.1)' },
    { label: 'Total Transaksi', value: stats.transaksi, icon: <TrendingUp />, color: '#f093fb', bg: 'rgba(240,147,251,0.1)' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0f1923' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TrainIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 16, fontFamily: '"Playfair Display", serif' }}>
            KA Citra
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

      {/* Menu */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => setActiveMenu(item.path)}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 2,
                background: activeMenu === item.path
                  ? 'linear-gradient(135deg, rgba(240,147,251,0.15) 0%, rgba(245,87,108,0.15) 100%)'
                  : 'transparent',
                borderLeft: activeMenu === item.path ? '3px solid #f5576c' : '3px solid transparent',
                '&:hover': { background: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{
                minWidth: 36,
                color: activeMenu === item.path ? '#f5576c' : 'rgba(255,255,255,0.4)',
              }}>
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

      {/* User info */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', fontSize: 14 }}>
          A
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Admin</Typography>
          <Chip label="Administrator" size="small" sx={{ height: 16, fontSize: 9, background: 'rgba(245,87,108,0.2)', color: '#f5576c', mt: 0.2 }} />
        </Box>
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} size="small" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#f5576c' } }}>
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#111b27' }}>
      {/* Sidebar Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* AppBar */}
        <AppBar position="static" elevation={0} sx={{ background: 'rgba(17,27,39,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Toolbar>
            <IconButton sx={{ display: { md: 'none' }, color: 'white', mr: 1 }} onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18, flex: 1 }}>
              {menuItems.find(m => m.path === activeMenu)?.label || 'Dashboard'}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          {activeMenu === 'dashboard' && (
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, fontSize: 14 }}>
                Selamat datang kembali, Admin 👋
              </Typography>

              {/* Stat Cards */}
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {statCards.map((stat) => (
                  <Grid item xs={12} sm={6} lg={3} key={stat.label}>
                    <Card sx={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 3,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' },
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{
                            width: 44, height: 44, borderRadius: 2,
                            background: stat.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: stat.color,
                          }}>
                            {stat.icon}
                          </Box>
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, mb: 0.5 }}>
                          {stat.label}
                        </Typography>
                        <Typography sx={{ color: 'white', fontSize: 28, fontWeight: 800 }}>
                          {stat.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Quick Actions */}
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Aksi Cepat
              </Typography>
              <Grid container spacing={2}>
                {menuItems.slice(1).map((item) => (
                  <Grid item xs={6} sm={4} md={3} key={item.path}>
                    <Card
                      onClick={() => setActiveMenu(item.path)}
                      sx={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          background: 'rgba(245,87,108,0.08)',
                          borderColor: 'rgba(245,87,108,0.3)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                        <Box sx={{ color: '#f5576c', mb: 1 }}>{item.icon}</Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500 }}>
                          {item.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeMenu !== 'dashboard' && (
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 400, flexDirection: 'column', gap: 2,
            }}>
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
