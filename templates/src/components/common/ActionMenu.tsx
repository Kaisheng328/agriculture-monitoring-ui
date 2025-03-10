import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';

interface Action {
  id: number;
  icon: string;
  title: string;
  onClick?: () => void;
}

interface ActionMenuProps {
  actions: Action[];
}

const ActionMenu = ({ actions }: ActionMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleActionButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionItemClick = (onClick?: () => void) => {
    handleActionMenuClose();
    if (onClick) {
      onClick(); // Execute the action
    }
  }
  return (
    <>
      <IconButton onClick={handleActionButtonClick} size="small" sx={{ zIndex: 1000 }}>
        <IconifyIcon icon="solar:menu-dots-bold" color="neutral.dark" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
        sx={{
          mt: 0.5,
          '& .MuiList-root': {
            width: 120,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actions.map((actionItem, index) => (
          <MenuItem key={`${actionItem.id}-${index}`} onClick={() => handleActionItemClick(actionItem.onClick)}>
            <ListItemIcon sx={{ mr: 1, fontSize: 'h5.fontSize' }}>
              <IconifyIcon icon={actionItem.icon} color="text.primary" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="text.primary">{actionItem.title}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionMenu;
