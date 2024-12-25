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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
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
      await fetchComments(); // Refresh comments after adding
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
      await fetchComments(); // Refresh comments after deleting
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression du commentaire');
      console.error('Error deleting comment:', err);
    } finally {
      setSubmitting(false);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Commentaires</Typography>
      </Box>

      {error && (
        <Paper sx={{ m: 2, p: 2 }} elevation={0}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: 'auto', px: 2 }}>
            {comments.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Aucun commentaire pour le moment
              </Typography>
            ) : (
              comments.map((comment, index) => (
                <React.Fragment key={comment._id || index}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      currentUser && comment.user && currentUser._id === comment.user._id && (
                        <IconButton
                          edge="end"
                          aria-label="supprimer"
                          onClick={() => openDeleteDialog(comment)}
                          disabled={submitting}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {comment.user?.username?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography component="span" variant="subtitle2">
                            {comment.author?.username || 'Utilisateur inconnu'}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary">
                            {comment.createdAt ? 
                              formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr }) :
                              'Date inconnue'
                            }
                          </Typography>
                        </Box>
                      }
                      secondary={comment.content}
                      secondaryTypographyProps={{
                        sx: { whiteSpace: 'pre-wrap', mt: 0.5 }
                      }}
                    />
                  </ListItem>
                  {index < comments.length - 1 && <Divider variant="inset" component="li" />}
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
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting || !currentUser}
            multiline
            maxRows={4}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !newComment.trim() || !currentUser}
            sx={{ minWidth: 100 }}
            endIcon={<SendIcon />}
          >
            Envoyer
          </Button>
        </Box>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
