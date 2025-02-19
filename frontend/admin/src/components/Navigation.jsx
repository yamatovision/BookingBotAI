import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  EventNote as EventIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

function Navigation() {
  const menuItems = [
    { text: 'ダッシュボード', icon: <DashboardIcon />, path: '/' },
    { text: '予約管理', icon: <EventIcon />, path: '/reservations' },
    { text: 'メール設定', icon: <EmailIcon />, path: '/email/templates' },
    { divider: true },
    { text: 'プロンプト設定', icon: <SettingsIcon />, path: '/settings/prompts' },
    { text: '導入設定', icon: <CodeIcon />, path: '/integration' }
  ];

  return (
    <>
    <AppBar 
  position="fixed" 
  sx={{ 
    zIndex: (theme) => theme.zIndex.drawer + 1,
    backgroundColor: 'primary.main'
  }}
>
  <Toolbar>
    <Typography variant="h6" noWrap component="div">
      AIアポ 管理画面
    </Typography>
  </Toolbar>
</AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 8
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            item.divider ? (
              <Divider key={`divider-${index}`} />
            ) : (
              <ListItem 
                button 
                key={item.text} 
                component={RouterLink} 
                to={item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navigation;