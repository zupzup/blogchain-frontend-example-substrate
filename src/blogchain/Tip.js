import { Grid, Form, Input } from 'semantic-ui-react'
import { useState } from 'react'
import { TxButton } from '../substrate-lib/components'

function Tip(props) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ amount: 0 })
  const { postId } = props;

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))

  const { amount } = formState

  return (
      <Grid.Column width={8}>
        <h3>Tip</h3>
        <Form>
          <Form.Field>
            <Input label="Amount" type="text"  state="amount" onChange={onChange} amount={amount} placeholder="10000" />
          </Form.Field>
          <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              label="Submit"
              type="SIGNED-TX"
              setStatus={setStatus}
              attrs={{
                palletRpc: 'blogchain',
                callable: 'tipBlogPost',
                inputParams: [postId.toString(), amount],
                paramFields: [true, true],
              }}
            />
          </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
        </Form>
      </Grid.Column>
  )
}

export default Tip
