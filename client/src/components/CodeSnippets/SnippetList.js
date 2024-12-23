import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Star as StarIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

const SnippetCard = ({ snippet, onDelete }) => {
  const navigate = useNavigate();
  const { title, description, tags, isPublic, likes, createdAt } = snippet;

  const handleEdit = () => {
    navigate(`/editor/${snippet._id}`);
  };

  const handleView = () => {
    navigate(`/snippets/${snippet._id}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" noWrap>
            {title}
          </Typography>
          <Tooltip title={isPublic ? 'Public' : 'Privé'}>
            <IconButton size="small">
              {isPublic ? <PublicIcon color="primary" /> : <LockIcon color="action" />}
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2} sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {description || 'Aucune description'}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ marginBottom: 0.5 }}
            />
          ))}
        </Stack>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <StarIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {likes?.length || 0}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(createdAt)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
        <Tooltip title="Voir">
          <IconButton size="small" onClick={handleView}>
            <ViewIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier">
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Partager">
          <IconButton size="small">
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer">
          <IconButton size="small" onClick={() => onDelete(snippet._id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

const SnippetList = ({ snippets, onDelete }) => {
  return (
    <Grid container spacing={3}>
      {snippets.map((snippet) => (
        <Grid item xs={12} sm={6} md={4} key={snippet._id}>
          <SnippetCard snippet={snippet} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SnippetList;
