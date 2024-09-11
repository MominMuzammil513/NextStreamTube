"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Loader2, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast'; // Toast library
import { debounce } from 'lodash';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  ownerId: string;
  owner: {
    id: string;
    username: string;
    avatar: string;
  };
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface CommentsSectionProps {
  videoId: string;
  currentUser: User | null;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ videoId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const fetchComments = async () => {
    if (isLoading || !hasMore) return; // Prevent fetching if already loading or no more comments
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments?videoId=${videoId}&page=${page}&limit=10`);
      const data = await response.json();
      setComments(prevComments => [...prevComments, ...data.comments]);
      setHasMore(data.comments.length === 10);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommentsDebounced = debounce(fetchComments, 300); // Debounce to prevent continuous calling

  useEffect(() => {
    fetchCommentsDebounced();
    // Cleanup the debounce on unmount
    return () => {
      fetchCommentsDebounced.cancel();
    };
  }, [fetchCommentsDebounced]);

  const handleAddComment = async () => {
    if (!currentUser || !newComment.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, content: newComment }),
      });
      const addedComment = await response.json();
      setComments(prevComments => [addedComment, ...prevComments]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment.');
    }
  };

  const handleEditClick = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: editingCommentId, content: editedContent }),
      });
      const updatedComment = await response.json();
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === editingCommentId ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
      setEditedContent('');
      toast.success('Comment edited successfully!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to edit comment.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments?commentId=${commentId}`, { method: 'DELETE' });
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== commentId)
      );
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment.');
    }
  };

  return (
    <div className="comments-section mt-6 bg-gray-900 rounded-lg p-4">
      <h3 className="text-xl font-semibold text-white mb-4">Comments</h3>
      {currentUser && (
        <div className="flex items-start space-x-4 mb-6">
          <div className="avatar">
            <Image
              src={currentUser.avatar}
              alt={currentUser.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="flex-grow">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Comment
            </button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex space-x-4 pb-4 border-b border-gray-800">
            <div className="avatar">
              <Image
                src={comment.owner.avatar}
                alt={comment.owner.username}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">{comment.owner.username}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg"
                  />
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white mt-1">{comment.content}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="text-gray-400 hover:text-white flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" /> Like
                    </button>
                    <button className="text-gray-400 hover:text-white flex items-center">
                      <ThumbsDown className="w-4 h-4 mr-1" /> Dislike
                    </button>
                    {currentUser?.id === comment.ownerId && (
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleEditClick(comment.id, comment.content)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {isLoading && <Loader2 className="animate-spin text-white mx-auto" />}
        {hasMore && !isLoading && (
          <button
            onClick={fetchComments}
            className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Load More Comments
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
