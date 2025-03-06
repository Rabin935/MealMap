import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Avatar,
  Tooltip,
  alpha,
  Paper,
  Divider,
  useTheme,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Dashboard as DashboardIcon,
  Favorite as FavoriteIcon,
  Restaurant as RecipesIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  MenuBook as MenuBookIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecipeContext } from '../contexts/RecipeContext';

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [showRecipeMenu, setShowRecipeMenu] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { favorites } = useRecipeContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const recipeCategories = [
    {
      name: 'Breakfast',
      image: 'https://placehold.co/400x300/FF9800/FFFFFF/png?text=Breakfast',
      path: '/recipes/breakfast'
    },
    {
      name: 'Lunch',
      image: 'https://placehold.co/400x300/4CAF50/FFFFFF/png?text=Lunch',
      path: '/recipes/lunch'
    },
    {
      name: 'Dinner',
      image: 'https://placehold.co/400x300/2196F3/FFFFFF/png?text=Dinner',
      path: '/recipes/dinner'
    },
    {
      name: 'Desserts',
      image: 'https://placehold.co/400x300/E91E63/FFFFFF/png?text=Desserts',
      path: '/recipes/desserts'
    }
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const isCurrentPath = (path) => location.pathname === path;

  const NavButton = ({ to, icon: Icon, children, badgeContent }) => (
    <Button
      component={RouterLink}
      to={to}
      sx={{
        color: theme.palette.text.primary,
        px: 2.5,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        position: 'relative',
        overflow: 'hidden',
        fontWeight: isCurrentPath(to) ? 700 : 400,
        backgroundColor: isCurrentPath(to)
          ? alpha(theme.palette.primary.main, 0.1)
          : 'transparent',
        transition: 'all 0.3s ease',
        borderRadius: '12px',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          transform: 'translateY(-1px)',
        },
      }}
    >
      {badgeContent ? (
        <Badge badgeContent={badgeContent} color="primary">
          <Icon sx={{ fontSize: 20 }} />
        </Badge>
      ) : (
        <Icon sx={{ fontSize: 20 }} />
      )}
      {children}
    </Button>
  );

  const NavRecipeButton = () => (
    <Button
      component={RouterLink}
      to="/recipes"
      sx={{
        color: theme.palette.text.primary,
        px: 2.5,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        position: 'relative',
        overflow: 'hidden',
        fontWeight: isCurrentPath('/recipes') ? 700 : 400,
        backgroundColor: isCurrentPath('/recipes')
          ? alpha(theme.palette.primary.main, 0.1)
          : 'transparent',
        transition: 'all 0.3s ease',
        borderRadius: '12px',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          transform: 'translateY(-1px)',
        },
      }}
    >
      <RecipesIcon sx={{ fontSize: 20 }} />
      Recipes
    </Button>
  );

  const UserMenu = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Tooltip title="Account settings">
        <IconButton onClick={handleOpenUserMenu}>
          <Avatar
            alt={user?.name}
            src={user?.avatar}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid',
              borderColor: 'primary.main',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                borderColor: 'secondary.main',
              },
            }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        sx={{
          '& .MuiPaper-root': {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            right: '0 !important',
            left: 'auto !important',
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            alt={user?.name}
            src={user?.avatar}
            sx={{
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 1,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user?.email}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogout}
            sx={{
              mt: 1,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );

  return (
    <Box>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container 
          maxWidth="xl"
          sx={{
            '& .MuiContainer-root': {
              borderRadius: 0,
            },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, md: 70 },
              gap: 2,
            }}
          >
            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                gap: 1,
              }}
              onClick={() => navigate('/')}
            >
              <RestaurantMenuIcon 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: 32,
                }} 
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Recipe Finder
              </Typography>
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    mt: 1,
                    backdropFilter: 'blur(8px)',
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    borderRadius: 2,
                    p: 1,
                  },
                }}
              >
                <MenuItem
                  component={RouterLink}
                  to="/"
                  onClick={handleCloseNavMenu}
                  selected={isCurrentPath('/')}
                >
                  <HomeIcon sx={{ mr: 1 }} /> Home
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/recipes"
                  onClick={handleCloseNavMenu}
                  selected={isCurrentPath('/recipes')}
                >
                  <RecipesIcon sx={{ mr: 1 }} /> Recipes
                </MenuItem>
                {user && (
                  <MenuItem
                    component={RouterLink}
                    to="/favorites"
                    onClick={handleCloseNavMenu}
                    selected={isCurrentPath('/favorites')}
                  >
                    <Badge badgeContent={favorites?.length || 0} color="primary">
                      <FavoriteIcon sx={{ mr: 1 }} />
                    </Badge>
                    Favorites
                  </MenuItem>
                )}
                {user?.isAdmin && (
                  <MenuItem
                    component={RouterLink}
                    to="/admin"
                    onClick={handleCloseNavMenu}
                    selected={isCurrentPath('/admin')}
                  >
                    <DashboardIcon sx={{ mr: 1 }} /> Admin
                  </MenuItem>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                    Recipe Categories
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                    {recipeCategories.map((category) => (
                      <MenuItem
                        key={category.name}
                        component={RouterLink}
                        to={category.path}
                        onClick={handleCloseNavMenu}
                        sx={{
                          borderRadius: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            component="img"
                            src={category.image}
                            alt={category.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                        <Typography variant="body2">
                          {category.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Box>
                </Box>
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, alignItems: 'center' }}>
              <RestaurantMenuIcon 
                sx={{ 
                  mr: 1, 
                  fontSize: 28,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }} 
              />
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '.05rem',
                  color: 'white',
                  textDecoration: 'none',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Recipe Finder
              </Typography>
            </Box>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 4, flexGrow: 1 }}>
              <NavButton to="/" icon={HomeIcon}>
                Home
              </NavButton>
              <NavRecipeButton />
              {user && !user.isAdmin && (
                <NavButton 
                  to="/favorites" 
                  icon={FavoriteIcon}
                  badgeContent={favorites?.length || 0}
                >
                  Favorites
                </NavButton>
              )}
              {user?.isAdmin && (
                <NavButton to="/admin" icon={DashboardIcon}>
                  Dashboard
                </NavButton>
              )}
            </Box>

            {/* Theme Toggle and User Menu */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              <ThemeToggle />
              {user ? (
                <UserMenu />
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Favorites Navigation Bar - Only show for non-admin users and when on favorites pages */}
      {user && !user.isAdmin && location.pathname.startsWith('/favorites') && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            top: 70,
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.dark, 0.1)
              : alpha(theme.palette.primary.light, 0.1),
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar
              disableGutters
              sx={{
                minHeight: { xs: 48, md: 56 },
                gap: 3,
                justifyContent: 'center',
              }}
            >
              <Button
                component={RouterLink}
                to="/favorites"
                startIcon={
                  <Badge badgeContent={favorites?.length || 0} color="primary">
                    <FavoriteIcon />
                  </Badge>
                }
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                My Favorites
              </Button>
              <Button
                component={RouterLink}
                to="/favorites/recent"
                startIcon={<RestaurantMenuIcon />}
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                Recently Viewed
              </Button>
              <Button
                component={RouterLink}
                to="/favorites/collections"
                startIcon={<MenuBookIcon />}
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                My Collections
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </Box>
  );
};

export default Navbar; 