import React, { memo, useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Collapse,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const difficultyLevels = ['Facile', 'Moyen', 'Difficile'];
const categories = ['Algorithmes', 'Applications', 'Structures de données', 'Mathématiques'];

const ChallengeFilters = memo(({
  filters,
  onSearch,
  onDifficultyChange,
  onCategoryChange,
  onSortChange,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Stack spacing={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          fullWidth
          placeholder="Rechercher un défi..."
          value={filters.search}
          onChange={onSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterListIcon />
        </IconButton>
        {(filters.difficulty || filters.category || filters.sortBy !== '-createdAt') && (
          <IconButton onClick={onClearFilters}>
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      <Collapse in={showFilters}>
        <Stack spacing={2}>
          <Box display="flex" gap={2}>
            <FormControl fullWidth>
              <InputLabel>Difficulté</InputLabel>
              <Select
                value={filters.difficulty}
                onChange={onDifficultyChange}
                label="Difficulté"
              >
                <MenuItem value="">Tous</MenuItem>
                {difficultyLevels.map(level => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={filters.category}
                onChange={onCategoryChange}
                label="Catégorie"
              >
                <MenuItem value="">Toutes</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <ToggleButtonGroup
              value={filters.sortBy}
              exclusive
              onChange={onSortChange}
              aria-label="Tri"
            >
              <ToggleButton value="-createdAt" aria-label="Plus récents">
                Plus récents
              </ToggleButton>
              <ToggleButton value="difficulty" aria-label="Difficulté">
                Difficulté
              </ToggleButton>
              <ToggleButton value="-points" aria-label="Points">
                Points
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Collapse>
    </Stack>
  );
});

export default ChallengeFilters;
