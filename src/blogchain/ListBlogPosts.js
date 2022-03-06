import { useSubstrateState } from '../substrate-lib'
import { Grid, Button, Modal } from 'semantic-ui-react'
import { useEffect, useState } from 'react'

function ListBlogPosts() {
  const { api, keyring } = useSubstrateState()
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

  }, [api, keyring])

  useEffect(() => {
    api.query.blogchain.blogPostComments.entries().then((commentsMap) => {
      const c = commentsMap.reduce((acc, commentsEntry) => {
        return {
          ...acc,
          [commentsEntry[0].toHuman()]: commentsEntry[1].toHuman(),
        }
      }, {})
      setBlogPostComments(c)
      console.log(commentsMap, c)
    })

  }, [api, keyring])

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
      TODO: show author
      https://github.com/substrate-developer-hub/substrate-front-end-template/blob/tutorials/solutions/kitties/src/KittyCards.js
      TODO: show content
      TODO: show post comment form with blogPostId as value and input for content
      TODO: show tip form with blogPostId as value and input for amount
      {comments && comments.map((comment) => {
        return <div key={comment.content}>{comment.content}</div>
      })}
      Hello!! {post.id}
    </Modal>

  )
}

export default ListBlogPosts
