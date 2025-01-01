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
  Avatar,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

const SnippetCard = ({ snippet, onDelete }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { title, description, tags, isPublic, starCount, comments, createdAt, author } = snippet;

  const handleEdit = () => {
    navigate(`/editor/${snippet._id}`);
  };

  const handleView = () => {
    navigate('/editor', { state: { snippetId: snippet._id } });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        },
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar 
              src={author?.avatar} 
              alt={author?.username}
              sx={{ width: 32, height: 32 }}
            >
              {author?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2">
              {author?.username}
            </Typography>
          </Box>
          <Tooltip title={isPublic ? 'Public' : 'Privé'}>
            <IconButton size="small" sx={{ color: 'white' }}>
              {isPublic ? <PublicIcon /> : <LockIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          mb={2} 
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.5em'
          }}
        >
          {description || 'Aucune description'}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ 
                marginBottom: 0.5,
                borderRadius: 1
              }}
            />
          ))}
        </Stack>

        <Box 
          display="flex" 
          alignItems="center" 
          gap={2}
          sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <StarIcon fontSize="small" color="warning" />
            <Typography variant="body2">
              {starCount}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CommentIcon fontSize="small" />
            <Typography variant="body2">
              {comments?.length || 0}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} ml="auto">
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">
              {getTimeAgo(createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider />
      
      <CardActions sx={{ p: 1.5, gap: 1 }}>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={handleView}
          variant="contained"
          color="primary"
          sx={{ flex: 1 }}
        >
          Voir
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          variant="outlined"
          sx={{ flex: 1 }}
        >
          Modifier
        </Button>
        <IconButton 
          size="small" 
          onClick={() => onDelete(snippet._id)}
          sx={{ ml: 'auto' }}
        >
          <DeleteIcon color="error" />
        </IconButton>
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
