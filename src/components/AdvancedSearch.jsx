import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const difficultyLevels = ['Any', 'Easy', 'Medium', 'Hard'];
const cookingTimes = ['Any', '< 30 mins', '30-60 mins', '> 60 mins'];

const AdvancedSearch = ({ filters, onFilterChange, onSearch }) => {
  const handleChange = (field) => (event) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value,
    });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Advanced Search
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Search Input */}
        <TextField
          fullWidth
          label="Search recipes"
          value={filters.searchQuery}
          onChange={handleChange('searchQuery')}
          placeholder="Enter keywords..."
        />

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Cooking Time */}
          <FormControl sx={{ minWidth: 200, flex: 1 }}>
            <InputLabel>Cooking Time</InputLabel>
            <Select
              value={filters.cookingTime}
              label="Cooking Time"
              onChange={handleChange('cookingTime')}
            >
              {cookingTimes.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Difficulty */}
          <FormControl sx={{ minWidth: 200, flex: 1 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={filters.difficulty}
              label="Difficulty"
              onChange={handleChange('difficulty')}
            >
              {difficultyLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Servings */}
          <FormControl sx={{ minWidth: 200, flex: 1 }}>
            <InputLabel>Servings</InputLabel>
            <Select
              value={filters.servings}
              label="Servings"
              onChange={handleChange('servings')}
            >
              <MenuItem value="Any">Any</MenuItem>
              <MenuItem value="1-2">1-2 servings</MenuItem>
              <MenuItem value="3-4">3-4 servings</MenuItem>
              <MenuItem value="5+">5+ servings</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Search Button */}
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          sx={{
            mt: 2,
            alignSelf: 'flex-end',
            minWidth: 150,
            height: 45,
          }}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default AdvancedSearch; 