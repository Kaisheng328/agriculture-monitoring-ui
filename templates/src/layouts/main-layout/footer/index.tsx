import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = () => {
  return (
    <Typography
      mt={0.5}
      px={{ xs: 0, md: 3.75 }}
      py={3}
      color="text.secondary"
      variant="body2"
      sx={{ textAlign: { xs: 'center', md: 'right' } }}
      letterSpacing={0.5}
      fontWeight={500}
    >
      Copyright Reserved by{''}
      <Link href="https://github.com/Kaisheng328/agriculture-monitoring-ui" target="_blank" rel="noreferrer" fontWeight={600}>
        {'Kaisheng'}
      </Link>
    </Typography>
  );
};

export default Footer;
