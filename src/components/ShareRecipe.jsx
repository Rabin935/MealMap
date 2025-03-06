import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useRecipeContext } from '../contexts/RecipeContext';
import { motion } from 'framer-motion';

const ShareRecipe = ({ recipeId, recipeName }) => {
  const theme = useTheme();
  const { shareRecipe } = useRecipeContext();
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleShare = async (platform) => {
    try {
      await shareRecipe(recipeId, platform);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to share recipe. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/recipes/${recipeId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setOpenLinkDialog(false);
      setSnackbar({
        open: true,
        message: 'Link copied to clipboard!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to copy link. Please try again.',
        severity: 'error',
      });
    }
  };

  const shareButtons = [
    {
      platform: 'facebook',
      icon: <FacebookIcon />,
      label: 'Share on Facebook',
      color: '#1877F2',
    },
    {
      platform: 'twitter',
      icon: <TwitterIcon />,
      label: 'Share on Twitter',
      color: '#1DA1F2',
    },
    {
      platform: 'whatsapp',
      icon: <WhatsAppIcon />,
      label: 'Share on WhatsApp',
      color: '#25D366',
    },
    {
      platform: 'email',
      icon: <EmailIcon />,
      label: 'Share via Email',
      color: theme.palette.primary.main,
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {shareButtons.map(({ platform, icon, label, color }) => (
          <motion.div
            key={platform}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tooltip title={label}>
              <IconButton
                onClick={() => handleShare(platform)}
                sx={{
                  color: color,
                  '&:hover': {
                    backgroundColor: `${color}20`,
                  },
                }}
              >
                {icon}
              </IconButton>
            </Tooltip>
          </motion.div>
        ))}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Tooltip title="Copy Link">
            <IconButton
              onClick={() => setOpenLinkDialog(true)}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
      </Box>

      <Dialog
        open={openLinkDialog}
        onClose={() => setOpenLinkDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Recipe Link</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            margin="dense"
            value={`${window.location.origin}/recipes/${recipeId}`}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCopyLink}>
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareRecipe; 