"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

interface Reply {
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
  replies?: Reply[];
  likes: number;
  dislikes: number;
  userLikeStatus: 'liked' | 'disliked' | 'none';
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ videoId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);

  const fetchComments = async () => {
    if (isLoading || !hasMore) return;

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

  useEffect(() => {
    fetchComments();
  }, []);

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

  const handleReply = async (commentId: string) => {
    if (!currentUser || !replyContent[commentId]?.trim()) return;

    try {
      const response = await fetch('/api/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, content: replyContent[commentId] }),
      });
      const addedReply = await response.json();
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, replies: [addedReply, ...(comment.replies || [])] }
            : comment
        )
      );
      setReplyContent(prevState => ({ ...prevState, [commentId]: '' }));
      setShowReplyInput(null);
      toast.success('Reply added successfully!');
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply.');
    }
  };

  const handleEditClick = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
    setShowMenu(null);
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
      setShowMenu(null);
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment.');
    }
  };

  const handleLike = async (commentId: string) => {
    if (!currentUser) return;

    try {
      await fetch(`/api/comments/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, like: true }),
      });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1, userLikeStatus: 'liked' }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment.');
    }
  };

  const handleDislike = async (commentId: string) => {
    if (!currentUser) return;

    try {
      await fetch(`/api/comments/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, like: false }),
      });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, dislikes: comment.dislikes + 1, userLikeStatus: 'disliked' }
            : comment
        )
      );
    } catch (error) {
      console.error('Error disliking comment:', error);
      toast.error('Failed to dislike comment.');
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
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Comment
            </button>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="flex space-x-4">
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
                <span className="text-white font-semibold">{comment.owner.username}</span>
                <span className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</span>
              </div>
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-white">{comment.content}</div>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center space-x-1 ${
                    comment.userLikeStatus === 'liked' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span>{comment.likes > 0 ? comment.likes : ''}</span>
                </button>
                <button
                  onClick={() => handleDislike(comment.id)}
                  className={`flex items-center space-x-1 ${
                    comment.userLikeStatus === 'disliked' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ThumbsDown size={16} />
                </button>
                <button
                  onClick={() => setShowReplyInput(showReplyInput === comment.id ? null : comment.id)}
                  className="text-gray-400 hover:text-white text-sm font-medium"
                >
                  Reply
                </button>
                {currentUser?.id === comment.ownerId && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === comment.id ? null : comment.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {showMenu === comment.id && (
                      <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-2 z-10">
                        <button
                          onClick={() => handleEditClick(comment.id, comment.content)}
                          className="block text-white hover:text-blue-500 mb-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="block text-white hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {showReplyInput === comment.id && (
                <div className="mt-4">
                  <textarea
                    value={replyContent[comment.id] || ''}
                    onChange={(e) => setReplyContent(prevState => ({ ...prevState, [comment.id]: e.target.value }))}
                    placeholder="Add a reply..."
                    className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg"
                  />
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium"
                  >
                    Reply
                  </button>
                </div>
              )}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l border-gray-700">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="flex space-x-4 py-2">
                      <div className="avatar">
                        <Image
                          src={reply.owner.avatar}
                          alt={reply.owner.username}
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{reply.owner.username}</span>
                          <span className="text-gray-400 text-sm">{formatDate(reply.createdAt)}</span>
                        </div>
                        <div className="text-white mt-1">{reply.content}</div>
                        <div className="flex items-center space-x-4 mt-2">
                          <button className="text-gray-400 hover:text-white">
                            <ThumbsUp size={14} />
                          </button>
                          <button className="text-gray-400 hover:text-white">
                            <ThumbsDown size={14} />
                          </button>
                          <button
                            onClick={() => setShowReplyInput(showReplyInput === reply.id ? null : reply.id)}
                            className="text-gray-400 hover:text-white text-sm font-medium"
                          >
                            Reply
                          </button>
                        </div>
                        {showReplyInput === reply.id && (
                          <div className="mt-4">
                            <textarea
                              value={replyContent[reply.id] || ''}
                              onChange={(e) => setReplyContent(prevState => ({ ...prevState, [reply.id]: e.target.value }))}
                              placeholder="Add a reply..."
                              className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg"
                            />
                            <button
                              onClick={() => handleReply(comment.id)}
                              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium"
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        )}
        {hasMore && !isLoading && (
          <button
            onClick={fetchComments}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium"
          >
            Load More Comments
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;