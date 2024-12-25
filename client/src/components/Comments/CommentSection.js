import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import codeSnippetService from '../../services/codeSnippetService';

const CommentSection = ({ snippetId, currentUser, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchComments();
  }, [snippetId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await codeSnippetService.getSnippetById(snippetId);
      console.log('Fetched snippet:', response);
      setComments(response.snippet.comments || []);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des commentaires');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await codeSnippetService.addComment(snippetId, newComment);
      console.log('Added comment:', response);
      setNewComment('');
      await fetchComments();
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'ajout du commentaire');
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      setSubmitting(true);
      const response = await codeSnippetService.deleteComment(snippetId, commentToDelete._id);
      console.log('Deleted comment:', response);
      if (response.success) {
        await fetchComments(); // Refresh comments after successful deletion
        setError(null);
      } else {
        setError(response.error || 'Erreur lors de la suppression du commentaire');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression du commentaire');
      console.error('Error deleting comment:', err);
    } finally {
      setSubmitting(false);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'background.paper',
        position: 'relative',
        zIndex: 1
      }}>
        <Typography variant="h6">Commentaires</Typography>
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {error && (
        <Paper 
          sx={{ 
            m: 2, 
            p: 2,
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            zIndex: 2
          }} 
          elevation={2}
        >
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Box sx={{ 
        flex: 1, 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%'
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <List 
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              px: 2,
              pt: error ? 8 : 2,
              pb: 2
            }}
          >
            {comments.length === 0 ? (
              <Typography 
                color="text.secondary" 
                sx={{ 
                  textAlign: 'center', 
                  py: 3,
                  fontStyle: 'italic'
                }}
              >
                Aucun commentaire pour le moment
              </Typography>
            ) : (
              comments.map((comment, index) => (
                <React.Fragment key={comment._id || index}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      currentUser && comment.author && currentUser._id === comment.author._id && (
                        <IconButton
                          edge="end"
                          aria-label="supprimer"
                          onClick={() => openDeleteDialog(comment)}
                          disabled={submitting}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                    sx={{ pt: index === 0 ? 0 : 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {comment.author?.username?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography 
                            component="span" 
                            variant="subtitle2"
                            sx={{ 
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word'
                            }}
                          >
                            {comment.author?.username || 'Utilisateur inconnu'}
                          </Typography>
                          <Typography 
                            component="span" 
                            variant="caption" 
                            color="text.secondary"
                          >
                            {comment.createdAt ? 
                              formatDistanceToNow(new Date(comment.createdAt), { 
                                addSuffix: true, 
                                locale: fr 
                              }) :
                              'Date inconnue'
                            }
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          component="div"
                          variant="body2"
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            mt: 0.5,
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'
                          }}
                        >
                          {comment.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < comments.length - 1 && (
                    <Divider 
                      variant="inset" 
                      component="li" 
                      sx={{ mt: 2 }}
                    />
                  )}
                </React.Fragment>
              ))
            )}
          </List>
        )}
      </Box>

      <Box
        component="form"
        onSubmit={handleAddComment}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={currentUser ? "Ajouter un commentaire..." : "Connectez-vous pour commenter"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting || !currentUser}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper'
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !newComment.trim() || !currentUser}
            sx={{ 
              minWidth: { xs: 'auto', sm: 100 },
              px: { xs: 2, sm: 3 }
            }}
            endIcon={<SendIcon />}
          >
            {isMobile ? '' : 'Envoyer'}
          </Button>
        </Box>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth={isMobile}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce commentaire ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteComment}
            color="error"
            disabled={submitting}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentSection;
