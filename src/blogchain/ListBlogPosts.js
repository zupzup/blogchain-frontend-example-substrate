import { useSubstrateState } from '../substrate-lib'
import { Grid, Button, Modal } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import CreateComment from './CreateComment'
import Tip from './Tip'

function ListBlogPosts() {
  const { api } = useSubstrateState()
  const [ blogPosts, setBlogPosts ] = useState([])
  const [ blogPostComments, setBlogPostComments ] = useState({})

  useEffect(() => {
    api.query.blogchain.blogPosts.entries().then((posts) => {
      const p = posts.map(post => {
        return {
          id: post[0].toHuman(),
          content: post[1].toHuman().content,
          author: post[1].toHuman().author,
        }
      })
      setBlogPosts(p)
    })

  }, [api])

  useEffect(() => {
    api.query.blogchain.blogPostComments.entries().then((commentsMap) => {
      const c = commentsMap.reduce((acc, commentsEntry) => {
        return {
          ...acc,
          [commentsEntry[0].toHuman()]: commentsEntry[1].toHuman(),
        }
      }, {})
      setBlogPostComments(c)
    })

  }, [api])

  return (
      <Grid.Column width={8}>
        <h1>Blogposts</h1>
        {blogPosts.map((post) => {
          return <BlogPost key={post.id} post={post} comments={blogPostComments[post.id]}/>
        })}
      </Grid.Column>
  )
}

function BlogPost(props) {
  const { post, comments } = props

  return (
    <div>
      id: {post.id} <br />
      content: {post.content.substring(0, 15) + '...'} <br />
      author: {post.author}<br />
      <BlogPostModal post={post} comments={comments} />
      <hr/>
    </div>
  )
}

function BlogPostModal(props) {
  const [open, setOpen] = useState(false)
  const { post, comments } = props

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button>Detail</Button>
      }
    >
      <Modal.Header>Post ID: {post.id}</Modal.Header>
      <Modal.Content>
        <b>Author:</b> {post.author} <br />
        <b>Content:</b> {post.content}
      </Modal.Content>
      <Modal.Content>
        <h3>Comments:</h3>
        <ul>
          {comments && comments.map((comment) => {
            return <li key={comment.content}>{comment.author} wrote: <br />{comment.content}</li>
          })}
        </ul>

        <CreateComment postId={post.id} />
        <Tip postId={post.id} />
      </Modal.Content>
    </Modal>

  )
}

export default ListBlogPosts
