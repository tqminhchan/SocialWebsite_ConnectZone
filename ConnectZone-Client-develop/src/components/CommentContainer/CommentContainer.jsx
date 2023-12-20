import React from 'react'

import Comment from './Comment'

const CommentContainer = ({ post, comments, setComments }) => {
  return (
    <div>
      {comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} post={post} comments={comments} setComments={setComments} />
      ))}
    </div>
  )
}

export default CommentContainer
