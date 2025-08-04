import { Modal, Box, Typography, IconButton, Stack } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ActionModal = ({ open, onClose, title, children }: ActionModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <IconifyIcon icon="mdi:close" />
          </IconButton>
        </Stack>
        {children}
      </Box>
    </Modal>
  );
};

export default ActionModal;
